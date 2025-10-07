import { logger } from '../firebot';
import { TriviaGame } from '../globals';
import { answerEffect } from './answers';
import { cancelGameEffect } from './cancel-game';
import { createGameEffect } from './create-game';

/**
 * Registers all effects for the trivia game
 */
export function registerEffects(triviaGame: TriviaGame): void {
    try {
        const effectManager = triviaGame.getFirebotManager().getEffectManager();
        effectManager.registerEffect(answerEffect);
        effectManager.registerEffect(cancelGameEffect);
        effectManager.registerEffect(createGameEffect);
        logger('info', "Trivia effects successfully registered");
    } catch (error) {
        logger('error', `Failed to register effects: ${error}`);
    }
}
