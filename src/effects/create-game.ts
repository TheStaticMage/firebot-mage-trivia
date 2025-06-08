import { Firebot } from '@crowbartools/firebot-custom-scripts-types';
import { logger } from '../firebot';
import { triviaGame } from '../globals';

const TRIVIA_CREATE_QUESTION_EFFECT_ID = "magetrivia:trivia:createQuestion";
const TRIVIA_CREATE_QUESTION_EFFECT_NAME = "[Mage Trivia] Create Trivia Question";

export const createGameEffect: Firebot.EffectType<any> = {
    definition: {
        id: TRIVIA_CREATE_QUESTION_EFFECT_ID,
        name: TRIVIA_CREATE_QUESTION_EFFECT_NAME,
        description: "Start a trivia question.",
        icon: "fad fa-question-circle",
        categories: ["scripting"]
    },
    optionsTemplate: "",
    optionsController: () => {},
    optionsValidator: () => {
        return [];
    },
    onTriggerEvent: async (event) => {
        logger('debug', `Called effect: ${TRIVIA_CREATE_QUESTION_EFFECT_NAME}`);
        await triviaGame.getGameManager().createGame(event.trigger);
    }
};
