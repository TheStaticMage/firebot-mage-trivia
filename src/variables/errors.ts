import { Effects } from '@crowbartools/firebot-custom-scripts-types/types/effects';
import { ReplaceVariable } from '@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager';
import { TRIVIA_EVENT_SOURCE_ID, TriviaEvent } from '../events';
import { logger } from '../firebot';
import { triviaGame } from '../globals';

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
    evaluator: (trigger: Effects.Trigger) => {
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
        handle: "mageTriviaErrorFullDONOTUSETHISINCHAT",
        description: "Returns the full error message if an error occurred in the trivia game. CAUTION: THIS MAY CONTAIN SENSITIVE INFORMATION AND SHOULD NOT BE USED IN CHAT.",
        possibleDataOutput: ["text"],
        triggers: {
            "manual": true,
            "event": [
                `${TRIVIA_EVENT_SOURCE_ID}:${TriviaEvent.ERROR_CRITICAL}`,
                `${TRIVIA_EVENT_SOURCE_ID}:${TriviaEvent.ERROR_RUNTIME}`
            ]
        }
    },
    evaluator: (trigger: Effects.Trigger) => {
        const safeMessage = trigger.metadata.eventData?.safeMessage as string;
        if (!safeMessage) {
            logger('warn', `Called mageTriviaErrorFullDONOTUSETHISINCHAT variable without error message. ${JSON.stringify(trigger.metadata)}`);
            return "";
        }

        let fullMessage = trigger.metadata.eventData?.message as string;
        if (!fullMessage || fullMessage === "" || fullMessage === safeMessage) {
            return safeMessage;
        }

        // If the user has not enabled the "Show Full Error Messages" setting,
        // we should not return the full error message.
        const triviaSettings = triviaGame.getFirebotManager().getGameSettings();
        if (!triviaSettings.otherSettings.enableTriviaErrorFull) {
            logger('warn', `Called mageTriviaErrorFullDONOTUSETHISINCHAT variable but the user has not enabled the "Show Full Error Messages" setting. ${JSON.stringify(trigger.metadata)}`);
            fullMessage = "(To see the full error, read the documentation or look in the Firebot logs.)";
        }

        logger('debug', `mageTriviaErrorFullDONOTUSETHISINCHAT: ${safeMessage} ${fullMessage}`);
        return `${safeMessage} ${fullMessage}`;
    }
};
