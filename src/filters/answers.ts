import { EventData, EventFilter, FilterSettings, PresetValue } from "@crowbartools/firebot-custom-scripts-types/types/modules/event-filter-manager";
import { triviaGame } from "../globals";

export const isTriviaAnswerFilter: EventFilter = {
    id: "magetrivia:trivia:isAnswerFilter",
    name: "[Mage Trivia] Is Trivia Answer",
    description: "Checks if the event is a trivia answer event.",
    events: [
        { eventSourceId: "twitch", eventId: "chat-message" }
    ],
    comparisonTypes: ["is", "is not"], // TODO expose these in custom-script-types
    valueType: "preset",
    presetValues(): PresetValue[] {
        return [
            { value: true, display: "True" },
            { value: false, display: "False" }
        ];
    },
    predicate(filterSettings: FilterSettings, eventData: EventData): boolean {
        const messageText = eventData.eventMeta.messageText as string;
        const answerIndex = triviaGame.getGameManager().validateAnswer(messageText);
        return answerIndex !== -1; // If the answer index is valid, return true
    }
};