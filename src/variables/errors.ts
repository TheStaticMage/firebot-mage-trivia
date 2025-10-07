import { Trigger } from '@crowbartools/firebot-custom-scripts-types/types/triggers';
import { ReplaceVariable } from '@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager';
import { TRIVIA_EVENT_SOURCE_ID, TriviaEvent } from '../events';
import { logger } from '../firebot';

export const mageTriviaError: ReplaceVariable = {
    definition: {
        handle: "mageTriviaError",
        description: "Returns the error message if an error occurred in the trivia game.",
        possibleDataOutput: ["text"],
        triggers: {
            "manual": true,
            "event": [
                `${TRIVIA_EVENT_SOURCE_ID}:${TriviaEvent.ERROR_CRITICAL}`,
                `${TRIVIA_EVENT_SOURCE_ID}:${TriviaEvent.ERROR_RUNTIME}`
            ]
        }
    },
    evaluator: async (trigger: Trigger) => {
        const safeMessage = trigger.metadata.eventData?.safeMessage as string;
        if (!safeMessage) {
            logger('warn', `Called mageTriviaError variable without error message. ${JSON.stringify(trigger.metadata)}`);
            return "";
        }
        logger('debug', `mageTriviaError: ${safeMessage}`);
        return safeMessage;
    }
};

export const mageTriviaErrorFull: ReplaceVariable = {
    definition: {
        handle: "mageTriviaErrorFull",
        aliases: ["mageTriviaErrorFullDONOTUSETHISINCHAT"],
        description: "Returns the full error message if an error occurred in the trivia game. CAUTION: THIS MAY CONTAIN SENSITIVE INFORMATION AND SHOULD NOT BE USED IN CHAT.",
        possibleDataOutput: ["text"],
        sensitive: true,
        triggers: {
            "manual": true,
            "event": [
                `${TRIVIA_EVENT_SOURCE_ID}:${TriviaEvent.ERROR_CRITICAL}`,
                `${TRIVIA_EVENT_SOURCE_ID}:${TriviaEvent.ERROR_RUNTIME}`
            ]
        }
    },
    evaluator: async (trigger: Trigger) => {
        const safeMessage = trigger.metadata.eventData?.safeMessage as string;
        if (!safeMessage) {
            logger('warn', `Called mageTriviaErrorFull variable without error message. ${JSON.stringify(trigger.metadata)}`);
            return "";
        }

        const fullMessage = trigger.metadata.eventData?.message as string;
        if (!fullMessage || fullMessage === "" || fullMessage === safeMessage) {
            return safeMessage;
        }

        logger('debug', `mageTriviaErrorFull: ${safeMessage} ${fullMessage}`);
        return `${safeMessage} ${fullMessage}`;
    }
};
