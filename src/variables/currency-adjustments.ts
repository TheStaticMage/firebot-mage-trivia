import { ReplaceVariable } from '@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager';
import { logger } from '../firebot';
import { triviaGame } from '../globals';

export const mageTriviaCurrencyAdjustments: ReplaceVariable = {
    definition: {
        handle: "mageTriviaCurrencyAdjustments",
        description: "Returns an object containing the currency adjustments for the most recently ended trivia game. The object keys are usernames and the values are the adjustment amounts (positive for awards, negative for deductions). When dry run mode is enabled, this returns the adjustments that would have been made. When dry run mode is disabled, this returns the actual adjustments that were applied to user balances.",
        possibleDataOutput: ["object"]
    },
    evaluator: async () => {
        const gameState = triviaGame.getGameManager().getGameState();
        if (!gameState) {
            logger('warn', 'Called mageTriviaCurrencyAdjustments variable when the game state was not initialized.');
            return {};
        }
        if (!gameState.complete) {
            logger('warn', 'Called mageTriviaCurrencyAdjustments variable when the game was not completed.');
            return {};
        }

        logger('debug', `mageTriviaCurrencyAdjustments: ${JSON.stringify(gameState.currencyAdjustments)}`);
        return gameState.currencyAdjustments;
    }
};
