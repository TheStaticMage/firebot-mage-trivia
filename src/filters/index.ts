import { TriviaGame } from '../globals';
import { isTriviaAnswerFilter } from './answers';

export function registerEventFilters(triviaGame: TriviaGame): void {
    triviaGame.getFirebotManager().registerEventFilter(isTriviaAnswerFilter);
}
