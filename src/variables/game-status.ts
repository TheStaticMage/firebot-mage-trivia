import { ReplaceVariable } from '@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager';
import { logger } from '../logger';
import { triviaGame } from '../globals';


export const mageTriviaGameInProgress: ReplaceVariable = {
    definition: {
        handle: "mageTriviaGameInProgress",
        description: "Returns whether or not a trivia game is in progress.",
        possibleDataOutput: ["bool"]
    },
    evaluator: () => {
        const data = triviaGame.getGameManager().isGameInProgress();
        logger("debug", `mageTriviaGameInProgress: ${String(data)}`);
        return data;
    }
};

export const mageTriviaGameTimeRemaining: ReplaceVariable = {
    definition: {
        handle: "mageTriviaGameTimeRemaining",
        description: "Returns the time remaining in the current trivia game in seconds. If no game is in progress, returns -1.",
        possibleDataOutput: ["number"]
    },
    evaluator: () => {
        const gameManager = triviaGame.getGameManager();
        const timeRemaining = gameManager.getTimeRemaining();
        logger("debug", `mageTriviaGameTimeRemaining: ${String(timeRemaining)}`);
        return timeRemaining;
    }
};
