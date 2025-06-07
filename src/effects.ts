import { Firebot } from '@crowbartools/firebot-custom-scripts-types';
import { Effects } from '@crowbartools/firebot-custom-scripts-types/types/effects';
import { logger } from './firebot';
import { TriviaGame } from './globals';

export const TRIVIA_ANSWER_EFFECT_ID = "magetrivia:trivia:answer";
export const TRIVIA_ANSWER_EFFECT_NAME = "[Mage Trivia] Process Trivia Answer";
export const TRIVIA_CANCEL_QUESTION_EFFECT_ID = "magetrivia:trivia:cancelQuestion";
export const TRIVIA_CANCEL_QUESTION_EFFECT_NAME = "[Mage Trivia] Cancel Trivia Question";
export const TRIVIA_CREATE_QUESTION_EFFECT_ID = "magetrivia:trivia:createQuestion";
export const TRIVIA_CREATE_QUESTION_EFFECT_NAME = "[Mage Trivia] Create Trivia Question";

export class TriviaGameEffects {
    private triviaGame: TriviaGame;

    constructor(triviaGame: TriviaGame) {
        this.triviaGame = triviaGame;
    }

    /**
     * Creates the effect for submitting a trivia answer
     * @returns The effect definition
     */
    private AnswerEffect(): Firebot.EffectType<{}> {
        return {
            definition: {
                id: TRIVIA_ANSWER_EFFECT_ID,
                name: TRIVIA_ANSWER_EFFECT_NAME,
                description: "Record the answer to a trivia question.",
                icon: "fad fa-comment-alt",
                categories: ["scripting"],
            },
            optionsTemplate: "",
            optionsController: () => {},
            optionsValidator: () => {
                return [];
            },
            onTriggerEvent: async (event) => {
                return await this.answerOnTrigger(event.trigger);
            },
        }
    }

    /**
     * Processes a trivia answer submitted through an effect trigger
     * @param trigger - The effect trigger event
     */
    private async answerOnTrigger(trigger: Effects.Trigger): Promise<void> {
        // Get user info
        const username = trigger.metadata.username;
        if (!username) {
            logger('error', 'Cannot process trivia answer: No username provided');
            return;
        }

        // Get user display name from the trigger
        let userDisplayName = trigger.metadata.eventData?.userDisplayName as string;
        if (!userDisplayName) {
            // If no display name is provided, use the username as a fallback
            userDisplayName = username;
            logger('warn', `No user display name provided for username "${username}", using username as display name.`);
        }

        // Get the message text from the trigger.
        const messageText = trigger.metadata.eventData?.messageText as string;
        if (!messageText) {
            logger('warn', `Trivia answer event called without message text`);
            return;
        }

        await this.triviaGame.getGameManager().handleAnswer(username, userDisplayName, messageText);
    }

    /**
     * Creates the effect for canceling a trivia game
     * @returns The effect definition
     */
    private CancelGameEffect(): Firebot.EffectType<{}> {
        return {
            definition: {
                id: TRIVIA_CANCEL_QUESTION_EFFECT_ID,
                name: TRIVIA_CANCEL_QUESTION_EFFECT_NAME,
                description: "Cancel the current trivia question.",
                icon: "fad fa-ban",
                categories: ["scripting"],
            },
            optionsTemplate: "",
            optionsController: () => {},
            optionsValidator: () => {
                return [];
            },
            onTriggerEvent: async (event) => {
                logger('debug', `Called effect: ${TRIVIA_CANCEL_QUESTION_EFFECT_NAME}`);
                await this.triviaGame.getGameManager().cancelGame(event.trigger);
            },
        }
    }

    /**
     * Creates trivia game
     * @returns The effect definition
     */
    private CreateGameEffect(): Firebot.EffectType<{}> {
        return {
            definition: {
                id: TRIVIA_CREATE_QUESTION_EFFECT_ID,
                name: TRIVIA_CREATE_QUESTION_EFFECT_NAME,
                description: "Start a trivia question.",
                icon: "fad fa-question-circle",
                categories: ["scripting"],
            },
            optionsTemplate: "",
            optionsController: () => {},
            optionsValidator: () => {
                return [];
            },
            onTriggerEvent: async (event) => {
                logger('debug', `Called effect: ${TRIVIA_CREATE_QUESTION_EFFECT_NAME}`);
                await this.triviaGame.getGameManager().createGame(event.trigger);
            },
        }
    }

    /**
     * Registers all effects for the trivia game
     */
    public registerEffects(): void {
        try {
            this.triviaGame.getFirebotManager().registerEffect(this.AnswerEffect());
            this.triviaGame.getFirebotManager().registerEffect(this.CancelGameEffect());
            this.triviaGame.getFirebotManager().registerEffect(this.CreateGameEffect());
            logger('info', "Trivia effects successfully registered");
        } catch (error) {
            logger('error', `Failed to register effects: ${error}`);
        }
    }
}
