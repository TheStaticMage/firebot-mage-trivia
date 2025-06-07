import { TriviaGame } from '../globals';
import { arrayJoinWith } from './array-join-with';
import { mageTriviaError, mageTriviaErrorFull } from './mage-trivia-error';
import { mageTriviaAnswers, mageTriviaCorrectAnswers, mageTriviaGameInProgress, mageTriviaGameResultsRaw, mageTriviaPossibleAnswers, mageTriviaQuestion, mageTriviaQuestionAndAnswersRaw, mageTriviaWinners, mageTriviaWinnersWithPoints } from './unorganized';
import { mageTriviaAnswerAccepted, mageTriviaAnswerRejected, mageTriviaAnswerRejectedRaw } from './user-answer';

export function registerReplaceVariables(triviaGame: TriviaGame): void {
    triviaGame.getFirebotManager().registerReplaceVariable(arrayJoinWith);
    triviaGame.getFirebotManager().registerReplaceVariable(mageTriviaAnswerAccepted);
    triviaGame.getFirebotManager().registerReplaceVariable(mageTriviaAnswerRejected);
    triviaGame.getFirebotManager().registerReplaceVariable(mageTriviaAnswerRejectedRaw);
    triviaGame.getFirebotManager().registerReplaceVariable(mageTriviaError);
    triviaGame.getFirebotManager().registerReplaceVariable(mageTriviaErrorFull);
    triviaGame.getFirebotManager().registerReplaceVariable(mageTriviaGameInProgress);
    triviaGame.getFirebotManager().registerReplaceVariable(mageTriviaQuestionAndAnswersRaw);
    triviaGame.getFirebotManager().registerReplaceVariable(mageTriviaQuestion);
    triviaGame.getFirebotManager().registerReplaceVariable(mageTriviaAnswers);
    triviaGame.getFirebotManager().registerReplaceVariable(mageTriviaCorrectAnswers);
    triviaGame.getFirebotManager().registerReplaceVariable(mageTriviaPossibleAnswers);
    triviaGame.getFirebotManager().registerReplaceVariable(mageTriviaGameResultsRaw);
    triviaGame.getFirebotManager().registerReplaceVariable(mageTriviaWinners);
    triviaGame.getFirebotManager().registerReplaceVariable(mageTriviaWinnersWithPoints);
}
