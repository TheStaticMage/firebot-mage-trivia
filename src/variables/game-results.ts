import { ReplaceVariable } from '@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager';
import { logger } from '../firebot';
import { triviaGame } from '../globals';

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
        examples: [
            {
                usage: `mageTriviaWinners`,
                description: `Returns array of winners like ["User1", "User2"].`
            },
            {
                usage: `mageTriviaWinners[twitch]`,
                description: `Returns array of winners like ["User1", "User2"]. Only includes winners from Twitch platform.`
            },
            {
                usage: `mageTriviaWinners[kick]`,
                description: `Returns array of winners like ["User1", "User2"]. Only includes winners from Kick platform. (Requires TheStaticMage's Kick integration.)`
            }
        ],
        possibleDataOutput: ["array"]
    },
    evaluator: async (trigger, platform = "all") => {
        // Handle case where platform is undefined, null, or empty string
        if (!platform || platform.trim() === "") {
            platform = "all";
        }

        const lastGameResults = triviaGame.getGameManager().getGameState();
        if (!lastGameResults) {
            logger('warn', 'Called mageTriviaWinners variable when no last game results were available.');
            return [];
        }
        if (!lastGameResults.complete) {
            logger('warn', 'Called mageTriviaWinners variable when the game was not completed.');
            return [];
        }
        const winners = lastGameResults.winners.filter((winner) => {
            if (platform.toLowerCase() === "all") {
                return true;
            }
            return winner.platform.toLowerCase() === platform.toLowerCase();
        }).map((winner) => {
            return winner.userDisplayName;
        });
        logger('debug', `mageTriviaWinners: ${JSON.stringify(winners)}`);
        return winners;
    }
};

export const mageTriviaWinnersWithPoints: ReplaceVariable = {
    definition: {
        handle: "mageTriviaWinnersWithPoints",
        description: "Returns an array of the winners of the last trivia game played with their points. (An empty array is returned if the game is not completed.)",
        examples: [
            {
                usage: `mageTriviaWinnersWithPoints`,
                description: `Returns array of winners like ["User1 (+42)", "User2 (+30)"].`
            },
            {
                usage: `mageTriviaWinnersWithPoints[twitch]`,
                description: `Returns array of winners like ["User1 (+42)", "User2 (+30)"]. Only includes winners from Twitch platform.`
            },
            {
                usage: `mageTriviaWinnersWithPoints[kick]`,
                description: `Returns array of winners like ["User1 (+42)", "User2 (+30)"]. Only includes winners from Kick platform. (Requires TheStaticMage's Kick integration.)`
            }
        ],
        possibleDataOutput: ["array"]
    },
    evaluator: async (trigger, platform = "all") => {
        // Handle case where platform is undefined, null, or empty string
        if (!platform || platform.trim() === "") {
            platform = "all";
        }

        const lastGameResults = triviaGame.getGameManager().getGameState();
        if (!lastGameResults) {
            logger('warn', 'Called mageTriviaLastGameWinnersWithPoints variable when no last game results were available.');
            return [];
        }
        if (!lastGameResults.complete) {
            logger('warn', 'Called mageTriviaLastGameWinnersWithPoints variable when the game was not completed.');
            return [];
        }
        const winnersWithPoints = lastGameResults.winners.filter((winner) => {
            if (platform.toLowerCase() === "all") {
                return true;
            }
            return winner.platform.toLowerCase() === platform.toLowerCase();
        }).map((winner) => {
            return `${winner.userDisplayName} (+${winner.points})`;
        });
        logger('debug', `mageTriviaLastGameWinnersWithPoints: ${JSON.stringify(winnersWithPoints)}`);
        return winnersWithPoints;
    }
};
