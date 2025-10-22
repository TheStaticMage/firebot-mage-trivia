import { mageTriviaGameResultsRaw, mageTriviaWinners, mageTriviaWinnersWithPoints } from './game-results';

jest.mock('../firebot', () => ({
    logger: jest.fn()
}));

jest.mock('../globals', () => ({
    triviaGame: {
        getGameManager: jest.fn()
    }
}));

import { triviaGame } from '../globals';

describe('Game Results Variables', () => {
    const mockGameManager = {
        getGameState: jest.fn()
    };

    const mockTrigger = { metadata: {} } as any;

    beforeEach(() => {
        jest.clearAllMocks();
        (triviaGame.getGameManager as jest.Mock).mockReturnValue(mockGameManager);
    });

    const mockCompletedGameState = {
        complete: true,
        winners: [
            {
                userDisplayName: 'Alice',
                platform: 'twitch',
                points: 42
            },
            {
                userDisplayName: 'Bob',
                platform: 'kick',
                points: 30
            },
            {
                userDisplayName: 'Charlie',
                platform: 'twitch',
                points: 25
            }
        ]
    };

    describe('mageTriviaGameResultsRaw', () => {
        it('returns empty object when game state is not initialized', async () => {
            mockGameManager.getGameState.mockReturnValue(null);

            const result = await mageTriviaGameResultsRaw.evaluator(mockTrigger);

            expect(result).toEqual({});
        });

        it('returns empty object when game is not completed', async () => {
            mockGameManager.getGameState.mockReturnValue({ complete: false });

            const result = await mageTriviaGameResultsRaw.evaluator(mockTrigger);

            expect(result).toEqual({});
        });

        it('returns game state when game is completed', async () => {
            mockGameManager.getGameState.mockReturnValue(mockCompletedGameState);

            const result = await mageTriviaGameResultsRaw.evaluator(mockTrigger);

            expect(result).toEqual(mockCompletedGameState);
        });
    });

    describe('mageTriviaWinners', () => {
        it('returns empty array when game state is not initialized', async () => {
            mockGameManager.getGameState.mockReturnValue(null);

            const result = await mageTriviaWinners.evaluator(mockTrigger, 'twitch');

            expect(result).toEqual([]);
        });

        it('returns empty array when game is not completed', async () => {
            mockGameManager.getGameState.mockReturnValue({ complete: false });

            const result = await mageTriviaWinners.evaluator(mockTrigger, 'twitch');

            expect(result).toEqual([]);
        });

        it('returns all winners when platform is "all"', async () => {
            mockGameManager.getGameState.mockReturnValue(mockCompletedGameState);

            const result = await mageTriviaWinners.evaluator(mockTrigger, 'all');

            expect(result).toEqual(['Alice', 'Bob', 'Charlie']);
        });

        it('returns only twitch winners when platform is "twitch"', async () => {
            mockGameManager.getGameState.mockReturnValue(mockCompletedGameState);

            const result = await mageTriviaWinners.evaluator(mockTrigger, 'twitch');

            expect(result).toEqual(['Alice', 'Charlie']);
        });

        it('returns only kick winners when platform is "kick"', async () => {
            mockGameManager.getGameState.mockReturnValue(mockCompletedGameState);

            const result = await mageTriviaWinners.evaluator(mockTrigger, 'kick');

            expect(result).toEqual(['Bob']);
        });

        // Regression test for the bug fix
        it('defaults to all platforms when platform is undefined', async () => {
            mockGameManager.getGameState.mockReturnValue(mockCompletedGameState);

            const result = await mageTriviaWinners.evaluator(mockTrigger, undefined as any);

            expect(result).toEqual(['Alice', 'Bob', 'Charlie']);
        });

        // Regression test for the bug fix
        it('defaults to all platforms when platform is null', async () => {
            mockGameManager.getGameState.mockReturnValue(mockCompletedGameState);

            const result = await mageTriviaWinners.evaluator(mockTrigger, null as any);

            expect(result).toEqual(['Alice', 'Bob', 'Charlie']);
        });

        // Regression test for the bug fix
        it('defaults to all platforms when platform is empty string', async () => {
            mockGameManager.getGameState.mockReturnValue(mockCompletedGameState);

            const result = await mageTriviaWinners.evaluator(mockTrigger, '');

            expect(result).toEqual(['Alice', 'Bob', 'Charlie']);
        });

        // Regression test for the bug fix
        it('defaults to all platforms when platform is whitespace only', async () => {
            mockGameManager.getGameState.mockReturnValue(mockCompletedGameState);

            const result = await mageTriviaWinners.evaluator(mockTrigger, '   ');

            expect(result).toEqual(['Alice', 'Bob', 'Charlie']);
        });

        it('handles case insensitive platform matching', async () => {
            mockGameManager.getGameState.mockReturnValue(mockCompletedGameState);

            const result = await mageTriviaWinners.evaluator(mockTrigger, 'TWITCH');

            expect(result).toEqual(['Alice', 'Charlie']);
        });
    });

    describe('mageTriviaWinnersWithPoints', () => {
        it('returns empty array when game state is not initialized', async () => {
            mockGameManager.getGameState.mockReturnValue(null);

            const result = await mageTriviaWinnersWithPoints.evaluator(mockTrigger, 'twitch');

            expect(result).toEqual([]);
        });

        it('returns empty array when game is not completed', async () => {
            mockGameManager.getGameState.mockReturnValue({ complete: false });

            const result = await mageTriviaWinnersWithPoints.evaluator(mockTrigger, 'twitch');

            expect(result).toEqual([]);
        });

        it('returns all winners with points when platform is "all"', async () => {
            mockGameManager.getGameState.mockReturnValue(mockCompletedGameState);

            const result = await mageTriviaWinnersWithPoints.evaluator(mockTrigger, 'all');

            expect(result).toEqual(['Alice (+42)', 'Bob (+30)', 'Charlie (+25)']);
        });

        it('returns only twitch winners with points when platform is "twitch"', async () => {
            mockGameManager.getGameState.mockReturnValue(mockCompletedGameState);

            const result = await mageTriviaWinnersWithPoints.evaluator(mockTrigger, 'twitch');

            expect(result).toEqual(['Alice (+42)', 'Charlie (+25)']);
        });

        it('returns only kick winners with points when platform is "kick"', async () => {
            mockGameManager.getGameState.mockReturnValue(mockCompletedGameState);

            const result = await mageTriviaWinnersWithPoints.evaluator(mockTrigger, 'kick');

            expect(result).toEqual(['Bob (+30)']);
        });

        // Regression test for the bug fix
        it('defaults to all platforms when platform is undefined', async () => {
            mockGameManager.getGameState.mockReturnValue(mockCompletedGameState);

            const result = await mageTriviaWinnersWithPoints.evaluator(mockTrigger, undefined as any);

            expect(result).toEqual(['Alice (+42)', 'Bob (+30)', 'Charlie (+25)']);
        });

        // Regression test for the bug fix
        it('defaults to all platforms when platform is null', async () => {
            mockGameManager.getGameState.mockReturnValue(mockCompletedGameState);

            const result = await mageTriviaWinnersWithPoints.evaluator(mockTrigger, null as any);

            expect(result).toEqual(['Alice (+42)', 'Bob (+30)', 'Charlie (+25)']);
        });

        // Regression test for the bug fix
        it('defaults to all platforms when platform is empty string', async () => {
            mockGameManager.getGameState.mockReturnValue(mockCompletedGameState);

            const result = await mageTriviaWinnersWithPoints.evaluator(mockTrigger, '');

            expect(result).toEqual(['Alice (+42)', 'Bob (+30)', 'Charlie (+25)']);
        });

        // Regression test for the bug fix
        it('defaults to all platforms when platform is whitespace only', async () => {
            mockGameManager.getGameState.mockReturnValue(mockCompletedGameState);

            const result = await mageTriviaWinnersWithPoints.evaluator(mockTrigger, '   ');

            expect(result).toEqual(['Alice (+42)', 'Bob (+30)', 'Charlie (+25)']);
        });

        it('handles case insensitive platform matching', async () => {
            mockGameManager.getGameState.mockReturnValue(mockCompletedGameState);

            const result = await mageTriviaWinnersWithPoints.evaluator(mockTrigger, 'KICK');

            expect(result).toEqual(['Bob (+30)']);
        });
    });
});
