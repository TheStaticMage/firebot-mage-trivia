import { TriviaGame } from '../globals';
import { mageTriviaGameInProgress } from './game-in-progress';

/**
 * Registers all conditions for the trivia game
 */
export function registerConditions(triviaGame: TriviaGame): void {
    triviaGame.getFirebotManager().registerConditionType(mageTriviaGameInProgress);
}
