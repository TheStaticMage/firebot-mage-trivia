import { Firebot } from '@crowbartools/firebot-custom-scripts-types';
import { logger } from '../logger';
import { triviaGame } from '../globals';

const TRIVIA_CANCEL_QUESTION_EFFECT_ID = "magetrivia:trivia:cancelQuestion";
const TRIVIA_CANCEL_QUESTION_EFFECT_NAME = "[Mage Trivia] Cancel Trivia Question";

export const cancelGameEffect: Firebot.EffectType<any> = {
    definition: {
        id: TRIVIA_CANCEL_QUESTION_EFFECT_ID,
        name: TRIVIA_CANCEL_QUESTION_EFFECT_NAME,
        description: "Cancel the current trivia question.",
        icon: "fad fa-ban",
        categories: ["scripting"]
    },
    optionsTemplate: "",
    optionsController: () => {
        // No options to control for this effect
    },
    optionsValidator: () => {
        return [];
    },
    onTriggerEvent: async (event) => {
        logger('debug', `Called effect: ${TRIVIA_CANCEL_QUESTION_EFFECT_NAME}`);
        await triviaGame.getGameManager().cancelGame(event.trigger);
    }
};
