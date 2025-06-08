import { Effects } from '@crowbartools/firebot-custom-scripts-types/types/effects';
import { ReplaceVariable } from '@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager';
import { TRIVIA_EVENT_SOURCE_ID, TriviaEvent } from '../events';
import { logger } from '../logger';

export const mageTriviaAnswerAccepted: ReplaceVariable = {
    definition: {
        handle: "mageTriviaAnswerAccepted",
        description: "Returns an array of users who have answered when the 'Answer Accepted' event fires.",
        possibleDataOutput: ["array"],
        triggers: {
            "manual": true,
            "event": [`${TRIVIA_EVENT_SOURCE_ID}:${TriviaEvent.ANSWER_ACCEPTED}`]
        }
    },
    evaluator: (trigger: Effects.Trigger) => {
        const usernames = trigger.metadata.eventData?.usernames as string[];
        if (usernames.length === 0) {
            logger('warn', `Called mageTriviaAnswerAccepted variable without usernames. ${JSON.stringify(trigger.metadata)}`);
            return [];
        }
        logger('debug', `mageTriviaAnswerAccepted: ${JSON.stringify(usernames)}`);
        return usernames;
    }
};

export const mageTriviaAnswerRejected: ReplaceVariable = {
    definition: {
        handle: "mageTriviaAnswerRejected",
        description: "Returns the reason that an answer was rejected for the 'Answer Rejected' event.",
        possibleDataOutput: ["text"],
        triggers: {
            "manual": true,
            "event": [`${TRIVIA_EVENT_SOURCE_ID}:${TriviaEvent.ANSWER_REJECTED}`]
        }
    },
    evaluator: (trigger: Effects.Trigger) => {
        const metadata = trigger.metadata;
        return metadata.eventData?.reasonMessage;
    }
};

export const mageTriviaAnswerRejectedRaw: ReplaceVariable = {
    definition: {
        handle: "mageTriviaAnswerRejectedRaw",
        description: "Returns an object corresponding to the 'Answer Rejected' event.",
        possibleDataOutput: ["object"],
        triggers: {
            "manual": true,
            "event": [`${TRIVIA_EVENT_SOURCE_ID}:${TriviaEvent.ANSWER_REJECTED}`]
        }
    },
    evaluator: (trigger: Effects.Trigger) => {
        const metadata = trigger.metadata;
        return metadata;
    }
};
