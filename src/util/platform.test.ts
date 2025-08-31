import { platformEvaluator } from './platform';

// Minimal local type for test triggers
type TestTrigger = {
    type: 'manual' | 'event';
    metadata: any;
};

describe('platformEvaluator', () => {
    it('returns kick for manual trigger with mage-kick-integration event source', () => {
        const trigger: TestTrigger = {
            type: 'manual',
            metadata: { eventSource: { id: 'mage-kick-integration', name: 'Kick' }, username: '' }
        };
        expect(platformEvaluator(trigger)).toBe('kick');
    });

    it('returns twitch for manual trigger with twitch event source', () => {
        const trigger: TestTrigger = {
            type: 'manual',
            metadata: { eventSource: { id: 'twitch', name: 'Twitch' }, username: '' }
        };
        expect(platformEvaluator(trigger)).toBe('twitch');
    });

    it('returns platform from eventData.platform if present', () => {
        const trigger: TestTrigger = {
            type: 'event',
            metadata: { eventData: { platform: 'kick' }, username: '' }
        };
        expect(platformEvaluator(trigger)).toBe('kick');
    });

    it('returns platform from metadata.platform if present', () => {
        const trigger: TestTrigger = {
            type: 'event',
            metadata: { platform: 'twitch', username: '' }
        };
        expect(platformEvaluator(trigger)).toBe('twitch');
    });

    it('returns kick for mage-kick-integration event source', () => {
        const trigger: TestTrigger = {
            type: 'event',
            metadata: { eventSource: { id: 'mage-kick-integration', name: 'Kick' }, username: '' }
        };
        expect(platformEvaluator(trigger)).toBe('kick');
    });

    it('returns kick for chatMessage.userId starting with k', () => {
        const trigger: TestTrigger = {
            type: 'event',
            metadata: { chatMessage: { userId: 'k123', username: 'user' }, username: '' }
        };
        expect(platformEvaluator(trigger)).toBe('kick');
    });

    it('returns kick for chatMessage.username ending with @kick', () => {
        const trigger: TestTrigger = {
            type: 'event',
            metadata: { chatMessage: { userId: '123', username: 'user@kick' }, username: '' }
        };
        expect(platformEvaluator(trigger)).toBe('kick');
    });

    it('returns twitch for chatMessage with userId or username not matching kick', () => {
        const trigger: TestTrigger = {
            type: 'event',
            metadata: { chatMessage: { userId: '123', username: 'user' }, username: '' }
        };
        expect(platformEvaluator(trigger)).toBe('twitch');
    });

    it('returns kick for eventData.userId starting with k', () => {
        const trigger: TestTrigger = {
            type: 'event',
            metadata: { eventData: { userId: 'k456' }, username: '' }
        };
        expect(platformEvaluator(trigger)).toBe('kick');
    });

    it('returns kick for eventData.username ending with @kick', () => {
        const trigger: TestTrigger = {
            type: 'event',
            metadata: { eventData: { username: 'foo@kick' }, username: '' }
        };
        expect(platformEvaluator(trigger)).toBe('kick');
    });

    it('returns twitch for eventData with userId or username not matching kick', () => {
        const trigger: TestTrigger = {
            type: 'event',
            metadata: { eventData: { userId: '123', username: 'foo' }, username: '' }
        };
        expect(platformEvaluator(trigger)).toBe('twitch');
    });

    it('returns kick for metadata.username ending with @kick', () => {
        const trigger: TestTrigger = {
            type: 'event',
            metadata: { username: 'bar@kick' }
        };
        expect(platformEvaluator(trigger)).toBe('kick');
    });

    it('returns twitch for metadata.username not empty and not ending with @kick', () => {
        const trigger: TestTrigger = {
            type: 'event',
            metadata: { username: 'bar' }
        };
        expect(platformEvaluator(trigger)).toBe('twitch');
    });

    it('returns eventSource.id if present and not matched above', () => {
        const trigger: TestTrigger = {
            type: 'event',
            metadata: { eventSource: { id: 'custom-platform', name: 'Custom' }, username: '' }
        };
        expect(platformEvaluator(trigger)).toBe('custom-platform');
    });

    it('returns unknown if nothing matches', () => {
        const trigger: TestTrigger = {
            type: 'event',
            metadata: { username: '' }
        };
        expect(platformEvaluator(trigger)).toBe('unknown');
    });
});
