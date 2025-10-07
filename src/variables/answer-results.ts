import { Trigger } from '@crowbartools/firebot-custom-scripts-types/types/triggers';
import { ReplaceVariable } from '@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager';
import { AnswerCorrectIncorrectMetadata, TRIVIA_EVENT_SOURCE_ID, TriviaEvent } from '../events';
import { logger } from '../firebot';

export const mageTriviaAnswerAmount: ReplaceVariable = {
    definition: {
        handle: "mageTriviaAnswerAmount",
        description: "Returns the amount of points a user won or lost for the 'Answer Correct' and 'Answer Incorrect' events.",
        possibleDataOutput: ["number"],
        triggers: {
            "manual": true,
            "event": [`${TRIVIA_EVENT_SOURCE_ID}:${TriviaEvent.ANSWER_CORRECT}`, `${TRIVIA_EVENT_SOURCE_ID}:${TriviaEvent.ANSWER_INCORRECT}`]
        }
    },
    evaluator: async (trigger: Trigger) => {
        const eventData = trigger.metadata?.eventData as AnswerCorrectIncorrectMetadata;
        if (!eventData) {
            logger('warn', 'Called mageTriviaAnswerAmount variable without expected metadata.');
            return 0;
        }
        return eventData.amount;
    }
};

export const mageTriviaAnswerIndex: ReplaceVariable = {
    definition: {
        handle: "mageTriviaAnswerIndex",
        description: "Returns the index of the answer a user selected for the 'Answer Correct' and 'Answer Incorrect' events.",
        possibleDataOutput: ["number"],
        triggers: {
            "manual": true,
            "event": [`${TRIVIA_EVENT_SOURCE_ID}:${TriviaEvent.ANSWER_CORRECT}`, `${TRIVIA_EVENT_SOURCE_ID}:${TriviaEvent.ANSWER_INCORRECT}`]
        }
    },
    evaluator: async (trigger: Trigger) => {
        const eventData = trigger.metadata?.eventData as AnswerCorrectIncorrectMetadata;
        if (!eventData) {
            logger('warn', 'Called mageTriviaAnswerIndex variable without expected metadata.');
            return 0;
        }
        return eventData.answerIndex;
    }
};

export const mageTriviaAnswerLetter: ReplaceVariable = {
    definition: {
        handle: "mageTriviaAnswerLetter",
        description: "Returns the letter of the answer a user selected for the 'Answer Correct' and 'Answer Incorrect' events.",
        possibleDataOutput: ["text"],
        triggers: {
            "manual": true,
            "event": [`${TRIVIA_EVENT_SOURCE_ID}:${TriviaEvent.ANSWER_CORRECT}`, `${TRIVIA_EVENT_SOURCE_ID}:${TriviaEvent.ANSWER_INCORRECT}`]
        }
    },
    evaluator: async (trigger: Trigger) => {
        const eventData = trigger.metadata?.eventData as AnswerCorrectIncorrectMetadata;
        if (!eventData) {
            logger('warn', 'Called mageTriviaAnswerLetter variable without expected metadata.');
            return "";
        }
        return eventData.answer;
    }
};

export const mageTriviaAnswerUsername: ReplaceVariable = {
    definition: {
        handle: "mageTriviaAnswerUsername",
        description: "Returns the username of the user who answered for the 'Answer Correct' and 'Answer Incorrect' events.",
        possibleDataOutput: ["text"],
        triggers: {
            "manual": true,
            "event": [`${TRIVIA_EVENT_SOURCE_ID}:${TriviaEvent.ANSWER_CORRECT}`, `${TRIVIA_EVENT_SOURCE_ID}:${TriviaEvent.ANSWER_INCORRECT}`]
        }
    },
    evaluator: async (trigger: Trigger) => {
        const eventData = trigger.metadata?.eventData as AnswerCorrectIncorrectMetadata;
        if (!eventData) {
            logger('warn', 'Called mageTriviaAnswerUsername variable without expected metadata.');
            return "";
        }
        return eventData.username;
    }
};
