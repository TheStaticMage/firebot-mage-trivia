import { mageTriviaCurrencyAdjustments } from '../currency-adjustments';

jest.mock('../../firebot', () => ({
    logger: jest.fn()
}));

jest.mock('../../globals', () => ({
    triviaGame: {
        getGameManager: jest.fn()
    }
}));

import { triviaGame } from '../../globals';

describe('Currency Adjustments Variable', () => {
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
        currencyAdjustments: {
            'TheStaticMage': 42,
            'TheStaticBrock': 30,
            'Firebot': -4
        }
    };

    describe('mageTriviaCurrencyAdjustments', () => {
        it('returns empty object when game state is not initialized', async () => {
            mockGameManager.getGameState.mockReturnValue(null);

            const result = await mageTriviaCurrencyAdjustments.evaluator(mockTrigger);

            expect(result).toEqual({});
        });

        it('returns empty object when game is not completed', async () => {
            mockGameManager.getGameState.mockReturnValue({ complete: false });

            const result = await mageTriviaCurrencyAdjustments.evaluator(mockTrigger);

            expect(result).toEqual({});
        });

        it('returns currency adjustments when game is completed', async () => {
            mockGameManager.getGameState.mockReturnValue(mockCompletedGameState);

            const result = await mageTriviaCurrencyAdjustments.evaluator(mockTrigger);

            expect(result).toEqual({
                'TheStaticMage': 42,
                'TheStaticBrock': 30,
                'Firebot': -4
            });
        });

        it('returns empty object when currencyAdjustments is empty', async () => {
            mockGameManager.getGameState.mockReturnValue({
                complete: true,
                currencyAdjustments: {}
            });

            const result = await mageTriviaCurrencyAdjustments.evaluator(mockTrigger);

            expect(result).toEqual({});
        });

        it('handles positive adjustments (awards)', async () => {
            mockGameManager.getGameState.mockReturnValue({
                complete: true,
                currencyAdjustments: {
                    'Alice': 50,
                    'Bob': 25
                }
            });

            const result = await mageTriviaCurrencyAdjustments.evaluator(mockTrigger);

            expect(result).toEqual({
                'Alice': 50,
                'Bob': 25
            });
        });

        it('handles negative adjustments (deductions)', async () => {
            mockGameManager.getGameState.mockReturnValue({
                complete: true,
                currencyAdjustments: {
                    'Charlie': -10,
                    'Dave': -5
                }
            });

            const result = await mageTriviaCurrencyAdjustments.evaluator(mockTrigger);

            expect(result).toEqual({
                'Charlie': -10,
                'Dave': -5
            });
        });

        it('handles mixed positive and negative adjustments', async () => {
            mockGameManager.getGameState.mockReturnValue({
                complete: true,
                currencyAdjustments: {
                    'Alice': 50,
                    'Bob': -10,
                    'Charlie': 25,
                    'Dave': -5
                }
            });

            const result = await mageTriviaCurrencyAdjustments.evaluator(mockTrigger);

            expect(result).toEqual({
                'Alice': 50,
                'Bob': -10,
                'Charlie': 25,
                'Dave': -5
            });
        });

        it('handles zero adjustments', async () => {
            mockGameManager.getGameState.mockReturnValue({
                complete: true,
                currencyAdjustments: {
                    'Alice': 0,
                    'Bob': 0
                }
            });

            const result = await mageTriviaCurrencyAdjustments.evaluator(mockTrigger);

            expect(result).toEqual({
                'Alice': 0,
                'Bob': 0
            });
        });
    });
});
