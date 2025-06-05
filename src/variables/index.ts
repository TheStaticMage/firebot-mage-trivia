import { TriviaGame } from '../globals';
import { arrayJoinWith } from './array-join-with';
import { mageTriviaError } from './mage-trivia-error';
import { mageTriviaAnswerAccepted, mageTriviaAnswerRejected, mageTriviaAnswerRejectedRaw } from './user-answer';

export function registerReplaceVariables(triviaGame: TriviaGame): void {
    triviaGame.getFirebotManager().registerReplaceVariable(arrayJoinWith);
    triviaGame.getFirebotManager().registerReplaceVariable(mageTriviaAnswerAccepted);
    triviaGame.getFirebotManager().registerReplaceVariable(mageTriviaAnswerRejected);
    triviaGame.getFirebotManager().registerReplaceVariable(mageTriviaAnswerRejectedRaw);
    triviaGame.getFirebotManager().registerReplaceVariable(mageTriviaError);
}