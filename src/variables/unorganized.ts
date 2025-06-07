// eslint-disable-next-line no-warning-comments
// TODO: Refactor this file to use the new variable organization.
// PLEASE DO NOT ADD ANY NEW VARIABLES HERE.

import { ReplaceVariable } from '@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager';
import { answerLabels } from '../constants';
import { logger } from '../firebot';
import { TriviaGame, triviaGame } from '../globals';
import { askedQuestion } from '../questions/common';

export const mageTriviaGameInProgress: ReplaceVariable = {
    definition: {
        handle: "mageTriviaGameInProgress",
        description: "Returns whether or not a trivia game is in progress.",
        possibleDataOutput: ["bool"]
    },
    evaluator: async () => {
        const data = triviaGame.getGameManager().isGameActive();
        logger("debug", `mageTriviaGameInProgress: ${data}`);
        return data;
    }
};

export const mageTriviaQuestionAndAnswersRaw: ReplaceVariable = {
    definition: {
        handle: "mageTriviaQuestionAndAnswersRaw",
        description: "Returns the current or most recently asked question and answer choices (raw object).",
        possibleDataOutput: ["object"]
    },
    evaluator: async () => {
        const question = triviaGame.getGameManager().getQuestion();
        if (!question) {
            logger('warn', 'Called mageTriviaQuestionAndAnswersRaw variable when no question was available.');
            return {};
        }
        return question;
    }
};

export const mageTriviaQuestion: ReplaceVariable = {
    definition: {
        handle: "mageTriviaQuestion",
        description: "Returns the text of the current or most-recently-asked question.",
        possibleDataOutput: ["text"]
    },
    evaluator: async () => {
        const aq = getAskedQuestion(triviaGame);
        if (!aq) {
            logger('warn', 'Called mageTriviaQuestion variable when no question was active or ended.');
            return "";
        }
        return aq.question.questionText;
    }
};

export const mageTriviaAnswers: ReplaceVariable = {
    definition: {
        handle: "mageTriviaAnswers",
        description: "Returns an array with the answers (with their letters) of the current or most-recently-asked question.",
        possibleDataOutput: ["array"]
    },
    evaluator: async () => {
        const aq = getAskedQuestion(triviaGame);
        if (!aq) {
            logger('warn', 'Called mageTriviaAnswers variable when no question was active or ended.');
            return [];
        }
        const answers = aq.answers.map((answer, index) => {
            return `(${answerLabels[index]}) ${answer}`;
        });
        logger('debug', `mageTriviaAnswers: ${JSON.stringify(answers)}`);
        return answers;
    }
};

export const mageTriviaCorrectAnswers: ReplaceVariable = {
    definition: {
        handle: "mageTriviaCorrectAnswers",
        description: "Returns an array with the correct answers (with their letters) of the current or most-recently-asked question.",
        possibleDataOutput: ["array"]
    },
    evaluator: async () => {
        const aq = getAskedQuestion(triviaGame);
        if (!aq) {
            logger('warn', 'Called mageTriviaCorrectAnswers variable when no question was active or ended.');
            return [];
        }
        const correctAnswers = aq.correctAnswers.map((index) => {
            return `(${answerLabels[index]}) ${aq.answers[index]}`;
        });
        logger('debug', `mageTriviaCorrectAnswers: ${JSON.stringify(correctAnswers)}`);
        return correctAnswers;
    }
};

export const mageTriviaPossibleAnswers: ReplaceVariable = {
    definition: {
        handle: "mageTriviaPossibleAnswers",
        description: "Returns an array of the possible answer letters for the current or most-recently-asked question.",
        possibleDataOutput: ["array"]
    },
    evaluator: async () => {
        const aq = getAskedQuestion(triviaGame);
        if (!aq) {
            logger('warn', 'Called mageTriviaPossibleAnswers variable when no question was active or ended.');
            return [];
        }
        const possibleAnswers = aq.answers.map((_, index) => answerLabels[index]);
        logger('debug', `mageTriviaPossibleAnswers: ${JSON.stringify(possibleAnswers)}`);
        return possibleAnswers;
    }
};

export const mageTriviaGameResultsRaw: ReplaceVariable = {
    definition: {
        handle: "mageTriviaGameResultsRaw",
        description: "Returns the raw object containing the results of the last trivia game played. (An empty object is returned if the game is not completed.)",
        possibleDataOutput: ["object"]
    },
    evaluator: async () => {
        const lastGameResults = triviaGame.getGameManager().getGameState();
        if (!lastGameResults) {
            logger('warn', 'Called mageTriviaGameResultsRaw variable when the game state was not initialized.');
            return {};
        }
        if (!lastGameResults.complete) {
            logger('warn', 'Called mageTriviaGameResultsRaw variable when the game was not completed.');
            return {};
        }

        logger('debug', `mageTriviaGameResultsRaw: ${JSON.stringify(lastGameResults)}`);
        return lastGameResults;
    }
};

export const mageTriviaWinners: ReplaceVariable = {
    definition: {
        handle: "mageTriviaWinners",
        description: "Returns an array of the winners of the last trivia game played. (An empty array is returned if the game is not completed.)",
        possibleDataOutput: ["array"]
    },
    evaluator: async () => {
        const lastGameResults = triviaGame.getGameManager().getGameState();
        if (!lastGameResults) {
            logger('warn', 'Called mageTriviaWinners variable when no last game results were available.');
            return [];
        }
        if (!lastGameResults.complete) {
            logger('warn', 'Called mageTriviaWinners variable when the game was not completed.');
            return [];
        }
        const winners = lastGameResults.winners.map((winner) => {
            return `${winner.userDisplayName}`;
        });
        logger('debug', `mageTriviaWinners: ${JSON.stringify(winners)}`);
        return winners;
    }
};

export const mageTriviaWinnersWithPoints: ReplaceVariable = {
    definition: {
        handle: "mageTriviaWinnersWithPoints",
        description: "Returns an array of the winners of the last trivia game played with their points. (An empty array is returned if the game is not completed.)",
        possibleDataOutput: ["array"]
    },
    evaluator: async () => {
        const lastGameResults = triviaGame.getGameManager().getGameState();
        if (!lastGameResults) {
            logger('warn', 'Called mageTriviaLastGameWinnersWithPoints variable when no last game results were available.');
            return [];
        }
        if (!lastGameResults.complete) {
            logger('warn', 'Called mageTriviaLastGameWinnersWithPoints variable when the game was not completed.');
            return [];
        }
        const winnersWithPoints = lastGameResults.winners.map((winner) => {
            return `${winner.userDisplayName} (+${winner.points})`;
        });
        logger('debug', `mageTriviaLastGameWinnersWithPoints: ${JSON.stringify(winnersWithPoints)}`);
        return winnersWithPoints;
    }
};

function getAskedQuestion(triviaGame: TriviaGame): askedQuestion | undefined {
    const game = triviaGame.getGameManager().getQuestion();
    if (game) {
        return game;
    }

    const lastResult = triviaGame.getGameManager().getGameState();
    if (lastResult) {
        return lastResult.askedQuestion;
    }

    return undefined;
}