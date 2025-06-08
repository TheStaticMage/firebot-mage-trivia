import { logger } from '../logger';
import { TriviaGame } from '../globals';
import { answerEffect } from './answers';
import { cancelGameEffect } from './cancel-game';
import { createGameEffect } from './create-game';

/**
 * Registers all effects for the trivia game
 */
export function registerEffects(triviaGame: TriviaGame): void {
    try {
        triviaGame.getFirebotManager().registerEffect(answerEffect);
        triviaGame.getFirebotManager().registerEffect(cancelGameEffect);
        triviaGame.getFirebotManager().registerEffect(createGameEffect);
        logger('info', "Trivia effects successfully registered");
    } catch (error) {
        logger('error', `Failed to register effects: ${error instanceof Error ? error.message : String(error)}`);
    }
}
