import { Firebot } from '@crowbartools/firebot-custom-scripts-types';
import { logger } from '../firebot';
import { triviaGame } from '../globals';

const TRIVIA_ANSWER_EFFECT_ID = "magetrivia:trivia:answer";
const TRIVIA_ANSWER_EFFECT_NAME = "[Mage Trivia] Process Trivia Answer";

export const answerEffect: Firebot.EffectType<any> = {
    definition: {
        id: TRIVIA_ANSWER_EFFECT_ID,
        name: TRIVIA_ANSWER_EFFECT_NAME,
        description: "Record the answer to a trivia question.",
        icon: "fad fa-comment-alt",
        categories: ["scripting"],
        dependencies: ["chat"]
    },
    optionsTemplate: "",
    optionsController: () => {
        // No options to control for this effect
    },
    optionsValidator: () => {
        return [];
    },
    onTriggerEvent: async (event) => {
        // Get user info
        const username = event.trigger.metadata.username;
        if (!username) {
            logger('error', 'Cannot process trivia answer: No username provided');
            return;
        }

        // Get user display name from the trigger
        let userDisplayName = event.trigger.metadata.eventData?.userDisplayName as string;
        if (!userDisplayName) {
            // If no display name is provided, use the username as a fallback
            userDisplayName = username;
            logger('warn', `No user display name provided for username "${username}", using username as display name.`);
        }

        // Get the message text from the trigger.
        const messageText = event.trigger.metadata.eventData?.messageText as string;
        if (!messageText) {
            logger('warn', `Trivia answer event called without message text`);
            return;
        }

        await triviaGame.getGameManager().handleAnswer(username, userDisplayName, messageText);
    }
};
