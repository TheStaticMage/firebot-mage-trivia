import { ReplaceVariable } from '@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager';

export const arrayJoinWith : ReplaceVariable = {
    definition: {
        handle: "arrayJoinWith",
        description: "Returns a string with each array item joined together with a comma and the last item preceded by the provided word.",
        usage: "arrayJoinWith[array, lastWord]",
        examples: [
            {
                usage: `arrayJoinWith["[1,2,3]", "and"]`,
                description: `Returns "1, 2 and 3".`
            },
            {
                usage: `arrayJoinWith["[1,2]", "and"]`,
                description: `Returns "1 and 2".`
            },
            {
                usage: `arrayJoinWith["[1]", "and"]`,
                description: `Returns "1".`
            },
            {
                usage: `arrayJoinWith["[]", "and"]`,
                description: `Returns "".`
            }
        ],
        categories: ["text"],
        possibleDataOutput: ["text"]
    },

    evaluator: (
        _,
        subject: string | unknown[],
        lastWord = ""
    ) : string => {
        let items: string[] = [];

        if (typeof subject === 'string' || subject instanceof String) {
            try {
                subject = JSON.parse(subject as string) as unknown[];
            } catch {
                return '';
            }
        }

        if (Array.isArray(subject)) {
            items = subject as string[];
        }

        if (items.length === 0) {
            return '';
        } else if (items.length === 1) {
            return items[0];
        } else if (items.length === 2) {
            return `${items[0]} ${lastWord as string} ${items[1]}`;
        }
        const lastItem = items.pop() ?? '';
        return `${items.join(', ')} ${lastWord as string} ${lastItem}`;
    }
};
