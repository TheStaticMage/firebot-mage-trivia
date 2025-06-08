import { ConditionType, PresetValue } from "@crowbartools/firebot-custom-scripts-types/types/modules/condition-manager";
import { triviaGame } from "../globals";

export const isTriviaGameActiveCondition: ConditionType<any, any, any> = {
    id: "magetrivia:trivia:isGameActiveCondition",
    name: "[Mage Trivia] Is Game Active",
    description: "Checks if a trivia game is currently active.",
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
        return triviaGame.getGameManager().isGameActive();
    }
};