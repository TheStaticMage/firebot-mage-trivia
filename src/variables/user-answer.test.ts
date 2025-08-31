import { mageTriviaAnswerAccepted } from './user-answer';

jest.mock('../firebot', () => ({
    logger: jest.fn()
}));

describe('mageTriviaAnswerAccepted.evaluator', () => {
    it('returns empty array if metadata.entries is undefined', async () => {
        const trigger = { metadata: {} };
        const result = await mageTriviaAnswerAccepted.evaluator(trigger as any);
        expect(result).toEqual([]);
    });

    const baseTrigger = {
        metadata: {
            eventData: {
                entries: [
                    {
                        username: 'alice',
                        userDisplayName: 'Alice',
                        trigger: { metadata: { platform: 'twitch' } }
                    },
                    {
                        username: 'bob',
                        userDisplayName: 'Bob',
                        trigger: { metadata: { platform: 'kick' } }
                    },
                    {
                        username: 'carol',
                        userDisplayName: 'Carol',
                        trigger: { metadata: { platform: 'twitch' } }
                    }
                ]
            }
        }
    };

    it('returns all user display names sorted by name', async () => {
        const result = await mageTriviaAnswerAccepted.evaluator(baseTrigger as any);
        expect(result).toEqual(['Alice', 'Bob', 'Carol']);
    });

    it('should ignore unrecognized filters and return all answers', async () => {
        const result = await mageTriviaAnswerAccepted.evaluator(baseTrigger as any, 'unknown=something');
        expect(result).toEqual(['Alice', 'Bob', 'Carol']);
    });

    it('filters by username', async () => {
        const result = await mageTriviaAnswerAccepted.evaluator(baseTrigger as any, 'username=alice');
        expect(result).toEqual(['Alice']);
    });

    it('filters by userDisplayName', async () => {
        const result = await mageTriviaAnswerAccepted.evaluator(baseTrigger as any, 'userDisplayName=Bob');
        expect(result).toEqual(['Bob']);
    });

    it('filters by platform', async () => {
        const result = await mageTriviaAnswerAccepted.evaluator(baseTrigger as any, 'platform=twitch');
        expect(result).toEqual(['Alice', 'Carol']);
    });

    it('filters by multiple filters (platform and username)', async () => {
        const result = await mageTriviaAnswerAccepted.evaluator(baseTrigger as any, 'platform=twitch', 'username=carol');
        expect(result).toEqual(['Carol']);
    });

    it('returns an empty array when a valid filter matches no entries', async () => {
        const result = await mageTriviaAnswerAccepted.evaluator(baseTrigger as any, 'username=nonexistent');
        expect(result).toEqual([]);
    });

    it('ignores arguments that are not formatted as key=value', async () => {
        const result = await mageTriviaAnswerAccepted.evaluator(baseTrigger as any, 'notAFilter');
        expect(result).toEqual(['Alice', 'Bob', 'Carol']);
    });

    it('trims leading and trailing whitespace around key and value in filter arguments', async () => {
        const result = await mageTriviaAnswerAccepted.evaluator(baseTrigger as any, '  username = alice  ');
        expect(result).toEqual(['Alice']);
    });
});
