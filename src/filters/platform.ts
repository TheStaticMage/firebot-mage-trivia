import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import { EventData, EventFilter, FilterEvent, PresetValue } from "@crowbartools/firebot-custom-scripts-types/types/modules/event-filter-manager";
import { TRIVIA_EVENT_SOURCE_ID, TriviaEvent } from "../events";
import { logger } from "../firebot";
import { platformEvaluator } from "../util/platform";

// This can be useful if the user is forwarding Kick events to the corresponding
// Twitch handlers. Otherwise it's kind of silly...
//
// We're only including the Twitch events that we might forward to. The Kick
// version of the events only ever come from Kick anyway, so this filter would
// be pointless to add to the Kick events.

const events = [
    TriviaEvent.ANSWER_REJECTED,
    TriviaEvent.ANSWER_CORRECT,
    TriviaEvent.ANSWER_INCORRECT
];

const applicableEvents: FilterEvent[] = events.map(eventId => ({
    eventSourceId: TRIVIA_EVENT_SOURCE_ID,
    eventId
}));

export const platformFilter: EventFilter = {
    id: `${TRIVIA_EVENT_SOURCE_ID}:platform`,
    name: "Platform",
    description: "Checks the platform where the original answer was given (as set by the Firebot Mage Kick Integration)",
    events: applicableEvents,
    comparisonTypes: ["is", "is not"],
    valueType: "preset",
    presetValues(): PresetValue[] {
        return [
            { value: "kick", display: "Kick" },
            { value: "twitch", display: "Twitch" },
            { value: "unknown", display: "Unknown" }
        ];
    },
    getSelectedValueDisplay: (filterSettings) => {
        switch (filterSettings.value) {
            case "kick":
                return "Kick";
            case "twitch":
                return "Twitch";
            case "unknown":
                return "Unknown";
            default:
                return `??? (${filterSettings.value})`;
        }
    },
    predicate: (
        filterSettings,
        eventData: EventData
    ): boolean => {
        const { comparisonType, value } = filterSettings;
        if (!eventData.eventMeta || !eventData.eventMeta.trigger) {
            logger('warn', 'Platform filter called without eventMeta or trigger');
            return true;
        }

        const trigger = eventData.eventMeta.trigger;
        if (!trigger || typeof trigger !== "object") {
            logger('warn', 'Platform filter: trigger is not of type Effects.Trigger');
            return true;
        }
        const originalTrigger: Effects.Trigger = trigger as unknown as Effects.Trigger;
        const platform = platformEvaluator(originalTrigger);
        return (comparisonType === "is" && platform === value) ||
               (comparisonType === "is not" && platform !== value);
    }
};
