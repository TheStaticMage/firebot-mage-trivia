import { Effects } from '@crowbartools/firebot-custom-scripts-types/types/effects';
import * as NodeCache from 'node-cache';
import { answerLabels } from './constants';
import { AnswerAcceptedMetadata, AnswerRejectedMetadata, AnswerRejectionReason, TRIVIA_EVENT_SOURCE_ID, TriviaEvent } from './events';
import { logger } from './firebot';
import { TriviaGame } from './globals';
import { askedQuestion } from './questions/common';
import { ErrorType, reportError } from './util/errors';
import { stripTrailingInvisibleCharacters } from './util/text';

/**
 * Entry for a user's answer to a question
 */
type AnswerEntry = {
    answerAt: number;
    answerIndex: number;
    award: number;
    correct: boolean;
    userDisplayName?: string; // Optional display name for the user
    wager: number; // The amount subtracted for an incorrect answer
}

/**
 * Metadata for a question that has ended
 */
export type GameState = {
    askedQuestion: askedQuestion; // The asked question object containing the question and answers
    inProgress: boolean; // Indicates if the game is in progress
    complete: boolean; // Indicates if the game is complete
    losers: { username: string; userDisplayName: string, answer: number, points: number }[]; // List of users who answered incorrectly
    winners: { username: string; userDisplayName: string, answer: number, points: number }[]; // List of winners with their points
    questionStart: number; // Timestamp when the question started
    totalLost: number; // Total amount lost by all users for incorrect answers
    totalAwarded: number; // Total amount awarded to winners
    totalPlayers: number; // Total number of players who answered
    totalCorrect: number; // Total number of correct answers
    totalIncorrect: number; // Total number of incorrect answers
}

/**
 * Manages the state and operations for trivia games
 */
export class GameManager {
    // State management
    private answersAccepted: NodeCache;
    private answerCache: NodeCache;
    private answerAcceptedTimer: NodeJS.Timeout | undefined;
    private gameState: GameState;
    private questionTimer: NodeJS.Timeout | undefined;
    private triviaGame: TriviaGame;

    constructor(triviaGame: TriviaGame) {
        this.triviaGame = triviaGame;
        this.answersAccepted = new NodeCache({checkperiod: 5});
        this.answerCache = new NodeCache({checkperiod: 5});
        this.answerAcceptedTimer = undefined;
        this.questionTimer = undefined;
        this.initGameState();
    }

    /**
     * Get the current game state as a raw object
     */
    getGameState(): GameState {
        return this.gameState;
    }

    /**
     * Get the current question
     */
    getQuestion(): askedQuestion | undefined {
        return this.gameState.askedQuestion;
    }

    /**
     * Get the time remaining in the current question
     * @returns The time remaining in seconds, or -1 if no question is in progress
     */
    getTimeRemaining(): number {
        if (!this.isGameInProgress()) {
            return -1;
        }

        const triviaSettings = this.triviaGame.getFirebotManager().getGameSettings();
        const elapsedTime = (Date.now() - this.gameState.questionStart) / 1000;
        const timeLimit = triviaSettings.gameplaySettings.timeLimit;

        return Math.max(0, timeLimit - elapsedTime);
    }

    /**
     * Check if a game is in progress
     */
    isGameInProgress(): boolean {
        return this.gameState && this.gameState.inProgress;
    }

    /**
     * Cancel the current game
     * @param trigger - The effect trigger event
     */
    async cancelGame(trigger: Effects.Trigger): Promise<void> {
        if (!this.isGameInProgress()) {
            reportError(
                ErrorType.RUNTIME_ERROR,
                '',
                'Cancel Trivia Question was called while there was no trivia game in progress.',
                trigger
            );
            return;
        }

        // Refund all wagers.
        this.answerCache.keys().forEach((user) => {
            const entry = this.answerCache.get<AnswerEntry>(user);
            if (entry) {
                logger('debug', `cancelGame: Refunding wager of ${entry.wager} for user ${user}.`);
                this.triviaGame.getFirebotManager().adjustCurrencyForUser(entry.wager, user);
            }
        });

        // Clear everything.
        this.clearTemporaryState();
        this.initGameState();

        // Fire the cancellation event.
        this.triviaGame.getFirebotManager().emitEvent(TRIVIA_EVENT_SOURCE_ID, TriviaEvent.GAME_CANCELLED, {}, false);
        logger('info', 'Trivia question has been canceled.');
    }

    /**
     * Create a new trivia question
     */
    async createGame(trigger: Effects.Trigger): Promise<void> {
        const triviaSettings = this.triviaGame.getFirebotManager().getGameSettings();

        // Make sure there isn't a game in progress already.
        if (this.isGameInProgress()) {
            reportError(
                ErrorType.RUNTIME_ERROR,
                '',
                'Create Trivia Question effect was called while there was already a trivia question in progress.',
                trigger
            );
            return;
        }

        this.initGameState();
        this.clearTemporaryState();

        // Get the question.
        const question = await this.triviaGame.getQuestionManager().getNewQuestion();
        if (!question) {
            reportError(
                ErrorType.CRITICAL_ERROR,
                '',
                'Could not get a question to create trivia game.',
                trigger
            );
            return;
        }

        const preparedQuestion = this.triviaGame.getQuestionManager().prepareQuestion(question);
        logger('debug', `createGame: A question has been prepared: ${preparedQuestion.question.questionText}`);

        // Initialize game state.
        this.initGameState();
        this.gameState.askedQuestion = preparedQuestion;
        this.gameState.questionStart = Date.now();
        this.gameState.inProgress = true;

        // Start the locked-in notification timer.
        const self = this;
        this.answerAcceptedTimer = setTimeout(() =>
            self.answerAcceptedHandler(true),
        triviaSettings.otherSettings.confirmationInterval * 1000
        );

        // Set the end-of-game timer.
        const answerTimeout = triviaSettings.gameplaySettings.timeLimit;
        this.questionTimer = setTimeout(() => {
            self.endGame();
        }, answerTimeout * 1000);

        // Emit the start event.
        this.triviaGame.getFirebotManager().emitEvent(TRIVIA_EVENT_SOURCE_ID, TriviaEvent.GAME_STARTED, {}, false);
        logger('info', 'createGame: A trivia question has started.');
    }

    /**
     * End the current game
     */
    async endGame(): Promise<void> {
        // Make sure there's actually a question in progress.
        if (!this.isGameInProgress()) {
            logger('warn', `endGame: function was called while trivia is not in progress.`);
            this.clearTemporaryState();
            return;
        }

        // Fire off one last "answer accepted" event but don't reschedule.
        if (this.answerAcceptedTimer) {
            clearTimeout(this.answerAcceptedTimer);
            this.answerAcceptedTimer = undefined;
        }
        await this.answerAcceptedHandler(false);

        // Award points to users who answered correctly and update the final
        // stats in the game state.
        const winnerPoints = new Map<string, number>();
        this.answerCache.keys().forEach((user) => {
            const cacheEntry = this.answerCache.get<AnswerEntry>(user);
            if (cacheEntry?.correct) {
                logger('debug', `User ${user} answered the question correctly. Awarding ${cacheEntry.award} points (includes refunding wager of ${cacheEntry.wager}).`);
                this.triviaGame.getFirebotManager().adjustCurrencyForUser(cacheEntry.award, user);
                winnerPoints.set(user, cacheEntry.award - cacheEntry.wager);
                this.gameState.totalAwarded += cacheEntry.award - cacheEntry.wager;
                this.gameState.totalCorrect++;
            } else {
                this.gameState.totalIncorrect++;
                this.gameState.totalLost += cacheEntry?.wager || 0;
            }
            this.gameState.totalPlayers++;
        });

        // Prepare and send the game ended event.
        const sortedWinnerNames = Array.from(winnerPoints.keys()).sort((a, b) => winnerPoints.get(b) - winnerPoints.get(a));
        const winnersWithPoints: { username: string; points: number }[] = [];
        for (const winner of sortedWinnerNames) {
            const points = winnerPoints.get(winner);
            if (points !== undefined) {
                winnersWithPoints.push({ username: winner, points: points });
            }
        }

        this.gameState.losers = Array.from(this.answerCache.keys())
            .filter(user => !this.answerCache.get<AnswerEntry>(user)?.correct)
            .map((username) => {
                const entry = this.answerCache.get<AnswerEntry>(username);
                return { username: username, userDisplayName: entry.userDisplayName || username, answer: entry?.answerIndex || -1, points: entry?.wager || 0 };
            });

        this.gameState.winners = Array.from(winnerPoints.keys())
            .filter(user => winnerPoints.get(user) !== undefined)
            .map((username) => {
                const entry = this.answerCache.get<AnswerEntry>(username);
                return { username: username, userDisplayName: entry.userDisplayName || username, answer: entry?.answerIndex || -1, points: winnerPoints.get(username) || 0 };
            });

        this.gameState.complete = true;
        this.gameState.inProgress = false;

        this.triviaGame.getFirebotManager().emitEvent(TRIVIA_EVENT_SOURCE_ID, TriviaEvent.GAME_ENDED, {}, false);

        // Clear everything.
        this.clearTemporaryState();

        logger('info', 'endGame: Trivia question has ended.');
    }

    /**
     * Handle a user's answer to a question
     */
    async handleAnswer(username: string, userDisplayName: string, messageText: string): Promise<boolean> {
        const answerIndex = this.validateAnswer(messageText);
        if (answerIndex === -1) {
            // We aren't logging this because we could end up effectively
            // logging every single message in chat.
            return false;
        }

        const triviaSettings = this.triviaGame.getFirebotManager().getGameSettings();
        const userBalance = await this.triviaGame.getFirebotManager().getUserCurrencyTotal(username);
        let wager = triviaSettings.currencySettings.wager;

        // We might allow users to change their answer.
        if (this.answerCache.has(username)) {
            const entry = this.answerCache.get<AnswerEntry>(username);
            wager = entry.wager; // Wager was already deducted when the user first answered.

            if (!triviaSettings.gameplaySettings.permitAnswerChange) {
                logger('debug', `handleAnswer: User ${username} has already answered the question.`);
                const rejection: AnswerRejectedMetadata = {
                    username: username,
                    answerIndex: answerIndex,
                    balance: userBalance,
                    wager: wager,
                    reasonCode: AnswerRejectionReason.ALREADY_ANSWERED,
                    reasonMessage: "You have already answered the question"
                };
                this.triviaGame.getFirebotManager().emitEvent(TRIVIA_EVENT_SOURCE_ID, TriviaEvent.ANSWER_REJECTED, rejection, false);
                return false;
            }

            if (entry.answerIndex === answerIndex) {
                logger('debug', `handleAnswer: User ${username} has already answered the question with the same answer.`);
                return false;
            }

            // If we get here the user changed their answer. However we don't want
            // to deduct the wager again, so there's no currency adjustment.
            logger('debug', `handleAnswer: User ${username} changed their answer to ${answerLabels[answerIndex]}. Previous answer was ${answerLabels[entry.answerIndex]}. Original wager was ${wager}.`);
        } else {
            // Check if the user has enough currency to cover an incorrect
            // answer. Adjust their wager downward if insufficient balances are
            // permitted.
            if (userBalance < triviaSettings.currencySettings.wager) {
                if (!triviaSettings.currencySettings.allowInsufficientBalance) {
                    logger('debug', `handleAnswer: User ${username} does not have enough currency to wager ${wager}.`);
                    const rejection: AnswerRejectedMetadata = {
                        username: username,
                        answerIndex: answerIndex,
                        balance: userBalance,
                        wager: wager,
                        reasonCode: AnswerRejectionReason.INSUFFICIENT_BALANCE,
                        reasonMessage: `You do not have enough currency to play. You need at least ${wager}.`
                    };
                    this.triviaGame.getFirebotManager().emitEvent(TRIVIA_EVENT_SOURCE_ID, TriviaEvent.ANSWER_REJECTED, rejection, false);
                    return false;
                }

                logger('debug', `handleAnswer: User ${username} does not have enough currency to wager ${wager} but is allowed to play. Wagering ${userBalance} instead.`);
                wager = userBalance;
            }

            // Always deduct the wager amount from the user's balance. It will
            // be re-added at the end of the question if the answer is correct,
            // but we don't want to tip off the user (or others) to correct
            // answers.
            this.triviaGame.getFirebotManager().adjustCurrencyForUser(-wager, username);
            logger('debug', `handleAnswer: User ${username} wagered ${wager} on the question.`);
        }

        // Create the answer cache entry for this user.
        const entry: AnswerEntry = {
            answerAt: Date.now(),
            answerIndex: answerIndex,
            award: 0,
            correct: false,
            userDisplayName: userDisplayName,
            wager: wager
        };

        // If the user answered correctly, award them the wager amount plus the time bonus.
        if (this.gameState.askedQuestion.correctAnswers.includes(answerIndex)) {
            logger('debug', `handleAnswer: Trivia answer correct: ${username} answered ${answerLabels[answerIndex]}. Correct answer(s): ${this.gameState.askedQuestion.correctAnswers.map(index => answerLabels[index]).join(', ')}.`);

            const maxBonus = triviaSettings.currencySettings.timeBonus;
            const maxTime = triviaSettings.gameplaySettings.timeLimit;
            const elapsedTime = (Date.now() - this.gameState.questionStart) / 1000;

            const timeBonusFactor = this.calculateTimeBonusFactor(elapsedTime, maxTime, triviaSettings.currencySettings.timeBonusDecay);
            const answerBonusPoints = Math.ceil(maxBonus * timeBonusFactor);
            const totalPoints = Math.ceil(wager + triviaSettings.currencySettings.payout + answerBonusPoints);

            entry.answerAt = Date.now();
            entry.award = totalPoints;
            entry.correct = true;

            logger('debug', `handleAnswer: Points calculation for ${username}: totalPoints=${totalPoints} wager=${wager}, timeBonusFactor=${timeBonusFactor}, decayFactor=${triviaSettings.currencySettings.timeBonusDecay}, elapsedTime=${elapsedTime}, maxTime=${maxTime}.`);
        } else {
            logger('debug', `handleAnswer: Answer incorrect: ${username} answered ${answerLabels[answerIndex]}. Correct answer(s): ${this.gameState.askedQuestion.correctAnswers.map(index => answerLabels[index]).join(', ')}.`);
        }

        // Remember the user's answer.
        this.answerCache.set(username, entry);

        // User answer accepted, for notification when the event next fires.
        this.answersAccepted.set(userDisplayName, true);

        // Successfully recorded the answer.
        return true;
    }

    validateAnswer(messageText: string): number {
        // Chatterino (and maybe others) will add a space and an invisible
        // Unicode character to get around Twitch spam detection. Remove any
        // such characters.
        const answer = stripTrailingInvisibleCharacters(messageText).trim();

        // Only single-character answers are valid.
        if (answer.length !== 1) {
            // We aren't logging this because we could end up effectively
            // logging every single message in chat.
            return -1;
        }

        // Check if a game is in progress and ignore any answers outside of the game.
        if (!this.isGameInProgress()) {
            logger('debug', `validateAnswer: Discarding possible trivia answer received while no question is in progress.`);
            return -1;
        }

        // Make sure the user's answer is one of the valid choices.
        const numberOfAnswers = this.gameState.askedQuestion.answers.length;
        const answerIndex = answerLabels.indexOf(answer.toUpperCase());
        if (answerIndex < 0 || answerIndex >= numberOfAnswers) {
            logger('debug', `validateAnswer: Discarding answer that is outside the range of possible choices: '${answer}'`);
            return -1;
        }

        return answerIndex;
    }

    /**
     * Notify users who have successfully submitted their answers.
     */
    async answerAcceptedHandler(reschedule: boolean): Promise<void> {
        const triviaSettings = this.triviaGame.getFirebotManager().getGameSettings();

        // Find users who have locked in their answers since the last notification
        const usernames = this.answersAccepted.keys();
        if (usernames.length > 0) {
            logger('debug', `answerAcceptedHandler: Trivia answers accepted for: ${usernames.join(', ')}`);
            const locked: AnswerAcceptedMetadata = {
                usernames: usernames.sort()
            };
            this.triviaGame.getFirebotManager().emitEvent(TRIVIA_EVENT_SOURCE_ID, TriviaEvent.ANSWER_ACCEPTED, locked, false);
            this.answersAccepted.flushAll();
        }

        // Reschedule the next run for this function
        if (reschedule) {
            this.answerAcceptedTimer = setTimeout(() =>
                this.answerAcceptedHandler(true),
            triviaSettings.otherSettings.confirmationInterval * 1000
            );
        } else if (this.answerAcceptedTimer) {
            clearTimeout(this.answerAcceptedTimer);
            this.answerAcceptedTimer = undefined;
        }
    }

    /**
     * Calculate time bonus factor based on elapsed time
     */
    private calculateTimeBonusFactor(elapsedTime: number, maxTime: number, decayFactor: number): number {
        let answerTimeFactor = elapsedTime / maxTime;
        answerTimeFactor = Math.max(0, Math.min(1, answerTimeFactor));
        return Math.pow(1 - answerTimeFactor, decayFactor);
    }

    /**
     * Clear all temporary game state
     */
    private clearTemporaryState(): void {
        this.answerCache.flushAll();
        this.answersAccepted.flushAll();

        if (this.answerAcceptedTimer) {
            clearTimeout(this.answerAcceptedTimer);
            this.answerAcceptedTimer = undefined;
        }

        if (this.questionTimer) {
            clearTimeout(this.questionTimer);
            this.questionTimer = undefined;
        }
    }

    /**
     * Initialize the game state to starting values
     */
    private initGameState(): void {
        this.gameState = {
            askedQuestion: undefined,
            inProgress: false,
            complete: false,
            losers: [],
            winners: [],
            questionStart: 0,
            totalLost: 0,
            totalAwarded: 0,
            totalPlayers: 0,
            totalCorrect: 0,
            totalIncorrect: 0
        };
    }
}
