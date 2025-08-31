import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";

// Taken from https://github.com/TheStaticMage/firebot-mage-kick-integration/blob/main/src/variables/platform.ts
// Would be super cool if we could just have Firebot resolve this
// internally somehow. If this is possible, please feel free to
// implement or let me know.
export function platformEvaluator(trigger: Effects.Trigger): string {
    // Manual trigger prefers the event source regardless of metadata
    if (trigger.type === "manual") {
        switch (trigger.metadata.eventSource?.id) {
            case "mage-kick-integration":
                return "kick";
            case "twitch":
                return "twitch";
        }
    }

    // See if the platform is explicitly set in the metadata
    if (typeof trigger.metadata.eventData?.platform === "string") {
        return trigger.metadata.eventData.platform;
    }

    if (typeof trigger.metadata.platform === "string") {
        return trigger.metadata.platform;
    }

    // If the event source is the Kick integration
    if (trigger.metadata.eventSource?.id === "mage-kick-integration") {
        return "kick";
    }

    // If there's a chat message, guess the platform from the user ID or username
    if (trigger.metadata.chatMessage) {
        const chatMessage = trigger.metadata.chatMessage;
        if (chatMessage.userId && chatMessage.userId.startsWith("k")) {
            return "kick";
        }

        if (chatMessage.username && chatMessage.username.endsWith("@kick")) {
            return "kick";
        }

        if (chatMessage.userId || chatMessage.username) {
            return "twitch";
        }
    }

    // If there's user information in the event, guess the platform from the user ID or username
    if (trigger.metadata.eventData) {
        const eventData = trigger.metadata.eventData;

        if (typeof eventData.userId === "string" && eventData.userId.startsWith("k")) {
            return "kick";
        }

        if (typeof eventData.username === "string" && eventData.username.endsWith("@kick")) {
            return "kick";
        }

        if (eventData.userId || eventData.username) {
            return "twitch";
        }
    }

    // Username in top level metadata
    if (typeof trigger.metadata.username === 'string') {
        if (trigger.metadata.username.endsWith('@kick')) {
            return "kick";
        }
        if (trigger.metadata.username !== '') {
            return "twitch";
        }
    }

    // If the event source is reported, we'll return it.
    if (typeof trigger.metadata.eventSource?.id === "string") {
        return trigger.metadata.eventSource.id;
    }

    // At this point we don't know
    return "unknown";
}
