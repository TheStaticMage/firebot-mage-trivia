import { TriviaGame } from '../globals';
import { isTriviaAnswerFilter } from './answers';
import { platformFilter } from './platform';

export function registerEventFilters(triviaGame: TriviaGame): void {
    triviaGame.getFirebotManager().registerEventFilter(isTriviaAnswerFilter);
    triviaGame.getFirebotManager().registerEventFilter(platformFilter);
}
