import { ConditionType, PresetValue } from "@crowbartools/firebot-custom-scripts-types/types/modules/condition-manager";
import { triviaGame } from "../globals";

export const mageTriviaGameInProgress: ConditionType<any, any, any> = {
    id: "magetrivia:trivia:gameInProgressCondition",
    name: "[Mage Trivia] Game In Progress",
    description: "Checks if a trivia game is currently in progress.",
    comparisonTypes: ["is"],
    rightSideValueType: "preset",
    leftSideValueType: "none",
    getRightSidePresetValues(): PresetValue[] {
        return [
            { value: "true", display: "True" },
            { value: "false", display: "False" }
        ];
    },
    predicate(): boolean {
        return triviaGame.getGameManager().isGameInProgress();
    }
};
