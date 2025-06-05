import { Effects } from '@crowbartools/firebot-custom-scripts-types/types/effects';
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
                TRIVIA_EVENT_SOURCE_ID + ":" + TriviaEvent.ERROR_CRITICAL,
                TRIVIA_EVENT_SOURCE_ID + ":" + TriviaEvent.ERROR_RUNTIME,
            ],
        },
    },
    evaluator: async (trigger: Effects.Trigger) => {
        const errorMessage = trigger.metadata.eventData?.message as string;
        if (!errorMessage) {
            logger('warn', `Called mageTriviaError variable without error message. ${JSON.stringify(trigger.metadata)}`);
            return "";
        }
        logger('debug', `mageTriviaError: ${errorMessage}`);
        return errorMessage;
    },
};
