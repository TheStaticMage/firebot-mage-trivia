import { EventSource } from '@crowbartools/firebot-custom-scripts-types/types/modules/event-manager';
import { TriviaGame } from './globals';

export const TRIVIA_EVENT_SOURCE_ID = "magetrivia";
export const TRIVIA_EVENT_SOURCE_NAME = "Mage Trivia Events";

export enum TriviaEvent {
    ANSWER_ACCEPTED = "triviaAnswerAccepted",
    ANSWER_CORRECT = "triviaAnswerCorrect",
    ANSWER_INCORRECT = "triviaAnswerIncorrect",
    ANSWER_REJECTED = "triviaAnswerRejected",
    ERROR_CRITICAL = "triviaErrorCritical",
    ERROR_RUNTIME = "triviaErrorRuntime",
    GAME_CANCELLED = "triviaGameCancelled",
    GAME_ENDED = "triviaGameEnded",
    GAME_STARTED = "triviaGameStarted",
}

/**
 * Enum for answer rejection reasons
 * Used in TRIVIA_ANSWER_REJECTED_EVENT metadata
 */
export enum AnswerRejectionReason {
    ALREADY_ANSWERED = 'alreadyAnswered',
    INSUFFICIENT_BALANCE = 'insufficientBalance',
    INTERNAL_ERROR = 'internalError',
}

/**
 * Metadata for an answer that was accepted (TRIVIA_ANSWER_ACCEPTED_EVENT)
 */
export type AnswerAcceptedMetadata = {
    usernames: string[];
}

/**
 * Metadata for an answer that was rejected (TRIVIA_ANSWER_REJECTED_EVENT)
 */
export type AnswerRejectedMetadata = {
    username: string;
    answerIndex: number;
    balance: number | undefined;
    wager: number | undefined;
    reasonCode: AnswerRejectionReason;
    reasonMessage: string;
}

export type AnswerCorrectIncorrectMetadata = {
    username: string;
    answer: string;
    answerIndex: number;
    amount: number; // The amount of points won or lost
}

/**
 * Metadata for a critical error or runtime error (TRIVIA_ERROR_CRITICAL_EVENT or TRIVIA_ERROR_RUNTIME_EVENT)
 */
export type ErrorMetadata = {
    message: string;
    safeMessage: string; // A sanitized version of the error message that can be safely displayed in chat
    trigger?: any; // Optional trigger data if the error was triggered by a specific event
}

const eventSource: EventSource = {
    id: TRIVIA_EVENT_SOURCE_ID,
    name: TRIVIA_EVENT_SOURCE_NAME,
    events: [
        {
            id: TriviaEvent.GAME_STARTED,
            name: "Game Started",
            description: "Fires when a game is first started."
        },
        {
            id: TriviaEvent.GAME_ENDED,
            name: "Game Ended",
            description: "Fires when a game's answer timer ends. (Does not fire if the game is cancelled.)"
        },
        {
            id: TriviaEvent.GAME_CANCELLED,
            name: "Game Cancelled",
            description: "Fires when a game is cancelled."
        },
        {
            id: TriviaEvent.ANSWER_ACCEPTED,
            name: "Answer Accepted Timer Fired",
            description: "Fires on a periodic basis while a game is in progress to acknowledge accepted answers."
        },
        {
            id: TriviaEvent.ANSWER_CORRECT,
            name: "Answer Correct",
            description: "Fires when the trivia game ends and a user answered the question correctly.",
            manualMetadata: {
                username: "firebot",
                answer: "A",
                answerIndex: 0,
                amount: 100
            }
        },
        {
            id: TriviaEvent.ANSWER_INCORRECT,
            name: "Answer Incorrect",
            description: "Fires when the trivia game ends and a user answered the question incorrectly.",
            manualMetadata: {
                username: "firebot",
                answer: "B",
                answerIndex: 1,
                amount: 50
            }
        },
        {
            id: TriviaEvent.ANSWER_REJECTED,
            name: "Answer Rejected",
            description: "Fires when a user's trivia answer is rejected.",
            manualMetadata: {
                username: "firebot",
                answer: "A",
                balance: 100,
                wager: 50,
                reasonCode: AnswerRejectionReason.INTERNAL_ERROR,
                reasonMessage: "Example rejection reason message"
            }
        },
        {
            id: TriviaEvent.ERROR_CRITICAL,
            name: "Critical Error",
            description: "Fires when a critical error occurs in the trivia game.",
            manualMetadata: {
                message: "Details of the error are here and may contain sensitive information.",
                safeMessage: "An error occurred in the trivia game. Please try again later."
            }
        },
        {
            id: TriviaEvent.ERROR_RUNTIME,
            name: "Runtime Error",
            description: "Fires when a normal priority runtime error occurs in the trivia game.",
            manualMetadata: {
                message: "Details of the error are here and may contain sensitive information.",
                safeMessage: "A runtime error occurred in the trivia game. Please try again later."
            }
        }
    ]
};

/**
 * Events that are emitted by the trivia game
 */
export class TriviaGameEvents {
    private triviaGame: TriviaGame;

    constructor(triviaGame: TriviaGame) {
        this.triviaGame = triviaGame;
    }

    public registerEvents() {
        this.triviaGame.getFirebotManager().registerEventSource(eventSource);
    }
}
