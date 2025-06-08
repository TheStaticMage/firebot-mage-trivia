import { TriviaGame } from '../globals';
import { isTriviaGameActiveCondition } from './game-active';

/**
 * Registers all conditions for the trivia game
 */
export function registerConditions(triviaGame: TriviaGame): void {
    triviaGame.getFirebotManager().registerConditionType(isTriviaGameActiveCondition);
}
