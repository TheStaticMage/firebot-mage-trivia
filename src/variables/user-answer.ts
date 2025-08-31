import { Effects } from '@crowbartools/firebot-custom-scripts-types/types/effects';
import { ReplaceVariable } from '@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager';
import { AnswerAcceptedMetadata, AnswerRejectedMetadata, TRIVIA_EVENT_SOURCE_ID, TriviaEvent } from '../events';
import { logger } from '../firebot';
import { platformEvaluator } from '../util/platform';

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
    evaluator: async (trigger: Effects.Trigger, ...args: any[]) => {
        const metadata = trigger.metadata.eventData as unknown as AnswerAcceptedMetadata;
        if (!metadata || !Array.isArray(metadata.entries)) {
            logger('warn', `Called mageTriviaAnswerAccepted variable without metadata.entries: ${JSON.stringify(trigger.metadata)}`);
            return [];
        }

        const filters: Record<string, string> = {};
        for (const arg of args) {
            if (typeof arg === "string" && arg.includes("=")) {
                const [key, value] = arg.split("=", 2).map(s => s.trim());
                if (key && value !== undefined) {
                    filters[key] = value;
                }
            }
        }

        const entries = metadata.entries.filter((entry) => {
            return Object.entries(filters).every(([key, value]) => {
                if (key === "username") {
                    return entry.username.toLowerCase() === value.toLowerCase();
                }

                if (key === "userDisplayName") {
                    return entry.userDisplayName.toLowerCase() === value.toLowerCase();
                }

                if (key === "platform") {
                    if (entry.trigger === undefined) {
                        logger('warn', `Called mageTriviaAnswerAccepted variable without platform information. ${JSON.stringify(trigger.metadata)}`);
                        return false;
                    }
                    const platform = platformEvaluator(entry.trigger);
                    return platform.toLowerCase() === value.toLowerCase();
                }

                logger('warn', `Unknown filter key in mageTriviaAnswerAccepted: ${key}`);
                return true;
            });
        });

        const usernames = entries.map(entry => entry.userDisplayName || entry.username);
        usernames.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'accent', caseFirst: 'false' }));
        logger('debug', `mageTriviaAnswerAccepted: args=${JSON.stringify(args)}, unfilteredUsersCount=${metadata.entries.length}, returnedUsersCount=${usernames.length}, usernames=${JSON.stringify(usernames)}`);
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
    evaluator: async (trigger: Effects.Trigger) => {
        const metadata = trigger.metadata as AnswerRejectedMetadata;
        if (!metadata) {
            logger('warn', 'Called mageTriviaAnswerRejected variable without metadata.');
            return {};
        }
        logger('debug', `mageTriviaAnswerRejected: ${metadata.reasonMessage}`);
        return metadata.reasonMessage;
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
    evaluator: async (trigger: Effects.Trigger) => {
        const metadata = trigger.metadata as AnswerRejectedMetadata;
        if (!metadata) {
            logger('warn', 'Called mageTriviaAnswerRejectedRaw variable without metadata.');
            return {};
        }
        logger('debug', `mageTriviaAnswerRejectedRaw: ${JSON.stringify(metadata)}`);
        return metadata;
    }
};
