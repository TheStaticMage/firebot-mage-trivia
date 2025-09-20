import { TriviaGame } from '../globals';
import { mageTriviaAnswerAmount, mageTriviaAnswerIndex, mageTriviaAnswerLetter, mageTriviaAnswerUsername } from './answer-results';
import { arrayJoinWith } from './array-join-with';
import { mageTriviaError, mageTriviaErrorFull } from './errors';
import { mageTriviaGameResultsRaw, mageTriviaWinners, mageTriviaWinnersWithPoints } from './game-results';
import { mageTriviaGameInProgress, mageTriviaGameTimeRemaining } from './game-status';
import { mageTriviaAnswers, mageTriviaCorrectAnswers, mageTriviaPossibleAnswers, mageTriviaQuestion, mageTriviaQuestionAndAnswersRaw } from './unorganized';
import { mageTriviaAnswerAccepted, mageTriviaAnswerRejected, mageTriviaAnswerRejectedRaw } from './user-answer';

export function registerReplaceVariables(triviaGame: TriviaGame): void {
    triviaGame.getFirebotManager().registerReplaceVariable(arrayJoinWith);
    triviaGame.getFirebotManager().registerReplaceVariable(mageTriviaAnswerAccepted);
    triviaGame.getFirebotManager().registerReplaceVariable(mageTriviaAnswerRejected);
    triviaGame.getFirebotManager().registerReplaceVariable(mageTriviaAnswerRejectedRaw);
    triviaGame.getFirebotManager().registerReplaceVariable(mageTriviaError);
    triviaGame.getFirebotManager().registerReplaceVariable(mageTriviaErrorFull);
    triviaGame.getFirebotManager().registerReplaceVariable(mageTriviaGameInProgress);
    triviaGame.getFirebotManager().registerReplaceVariable(mageTriviaGameTimeRemaining);
    triviaGame.getFirebotManager().registerReplaceVariable(mageTriviaQuestionAndAnswersRaw);
    triviaGame.getFirebotManager().registerReplaceVariable(mageTriviaQuestion);
    triviaGame.getFirebotManager().registerReplaceVariable(mageTriviaAnswers);
    triviaGame.getFirebotManager().registerReplaceVariable(mageTriviaCorrectAnswers);
    triviaGame.getFirebotManager().registerReplaceVariable(mageTriviaPossibleAnswers);
    triviaGame.getFirebotManager().registerReplaceVariable(mageTriviaGameResultsRaw);
    triviaGame.getFirebotManager().registerReplaceVariable(mageTriviaWinners);
    triviaGame.getFirebotManager().registerReplaceVariable(mageTriviaWinnersWithPoints);
    triviaGame.getFirebotManager().registerReplaceVariable(mageTriviaAnswerUsername);
    triviaGame.getFirebotManager().registerReplaceVariable(mageTriviaAnswerAmount);
    triviaGame.getFirebotManager().registerReplaceVariable(mageTriviaAnswerIndex);
    triviaGame.getFirebotManager().registerReplaceVariable(mageTriviaAnswerLetter);
}
