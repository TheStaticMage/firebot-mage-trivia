import { SettingCategoryDefinition } from '@crowbartools/firebot-custom-scripts-types/types/modules/game-manager';

export type GameSettings = {
    currencySettings: {
        currencyId: string;
        wager: number;
        payout: number;
        timeBonus: number;
        timeBonusDecay: number;
        allowInsufficientBalance: boolean;
        dryRunMode: boolean;
    };
    triviaDataSettings: {
        triviaSource: 'File' | 'API';
        triviaFile: string;
        enabledCategories: number[];
        enabledDifficulties: string[];
        enabledTypes: string[];
    };
    gameplaySettings: {
        answerSortOrder: 'Alphabetical' | 'Random';
        timeLimit: number;
        permitAnswerChange: boolean;
    };
    otherSettings: {
        confirmationInterval: number;
        persistAskedQuestionsToFile: boolean;
        recycleQuestions: boolean;
    };
};

export function gameSettings(): Record<string, SettingCategoryDefinition> {
    return {
        currencySettings: {
            title: 'Currency Settings',
            description: 'Currency settings for the game.',
            sortRank: 1,
            settings: {
                currencyId: {
                    type: 'currency-select',
                    title: 'Currency',
                    description: 'Which currency to use for this game.',
                    tip: 'Select the currency players will use throughout the game.',
                    default: '',
                    sortRank: 1,
                    showBottomHr: true,
                    validation: {
                        required: true
                    }
                },
                wager: {
                    type: "number",
                    title: "Incorrect Answer Penalty",
                    description: "The amount of currency to subtract for a wrong answer to a question.",
                    tip: "",
                    default: 10,
                    sortRank: 2,
                    showBottomHr: false,
                    validation: {
                        required: true,
                        min: 0
                    }
                },
                payout: {
                    type: "number",
                    title: "Correct Answer Payout",
                    description: "The amount of currency to award for a correct answer to a question.",
                    tip: "",
                    default: 10,
                    sortRank: 3,
                    showBottomHr: false,
                    validation: {
                        required: true,
                        min: 0
                    }
                },
                timeBonus: {
                    type: "number",
                    title: "Initial Time Bonus",
                    description: "The theoretical bonus points for a correct answer at t=0.",
                    tip: "",
                    default: 10,
                    sortRank: 4,
                    showBottomHr: false,
                    validation: {
                        required: true,
                        min: 0
                    }
                },
                timeBonusDecay: {
                    type: "number",
                    title: "Time Bonus Decay Factor",
                    description: "Higher numbers more disproportionately reward faster answers.",
                    tip: "Values between 1 and 3 are recommended.",
                    default: 1,
                    sortRank: 5,
                    showBottomHr: false,
                    validation: {
                        required: true,
                        min: 1
                    }
                },
                allowInsufficientBalance: {
                    type: "boolean",
                    title: "Allow Insufficient Balance",
                    description: "Whether to allow viewers to answer questions even if they don't have enough currency to cover an incorrect answer.",
                    tip: "Check the box to let players answer even if they don't have enough currency to cover an incorrect answer.",
                    default: false,
                    sortRank: 6,
                    showBottomHr: false,
                    validation: {
                        required: true
                    }
                },
                dryRunMode: {
                    type: "boolean",
                    title: "Dry Run Mode",
                    description: "When enabled, the plugin will not actually adjust user currency. Instead, it will track what adjustments would be made and make them available via the $mageTriviaCurrencyAdjustments replace variable.",
                    tip: "Check the box to enable dry run mode. This is useful if you want to review currency adjustments before applying them manually.",
                    default: false,
                    sortRank: 7,
                    showBottomHr: false,
                    validation: {
                        required: true
                    }
                }
            }
        },
        triviaDataSettings: {
            title: 'Trivia Data Settings',
            description: 'Settings related to the trivia data.',
            sortRank: 2,
            settings: {
                triviaSource: {
                    type: "enum",
                    title: 'Trivia Source',
                    description: 'Where to get trivia questions from.',
                    tip: 'Select the source of trivia questions.',
                    default: 'API',
                    options: ["File", "API"],
                    sortRank: 1,
                    showBottomHr: true,
                    validation: {
                        required: true
                    }
                },
                triviaFile: {
                    type: "filepath",
                    title: 'Trivia Source File',
                    description: 'YAML file with trivia questions.',
                    tip: '',
                    default: '',
                    sortRank: 2,
                    showBottomHr: true,
                    validation: {
                        required: true
                    }
                },
                enabledCategories: {
                    type: "multiselect",
                    title: "API Enabled Categories",
                    description: "Categories of questions that are enabled when using the API.",
                    tip: "You need at least one category selected for the API source to work.",
                    default: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30, 31, 32],
                    settings: {
                        options: [
                            {
                                "id": 9,
                                "name": "General Knowledge"
                            },
                            {
                                "id": 10,
                                "name": "Entertainment: Books"
                            },
                            {
                                "id": 11,
                                "name": "Entertainment: Film"
                            },
                            {
                                "id": 12,
                                "name": "Entertainment: Music"
                            },
                            {
                                "id": 13,
                                "name": "Entertainment: Musicals & Theatres"
                            },
                            {
                                "id": 14,
                                "name": "Entertainment: Television"
                            },
                            {
                                "id": 15,
                                "name": "Entertainment: Video Games"
                            },
                            {
                                "id": 16,
                                "name": "Entertainment: Board Games"
                            },
                            {
                                "id": 17,
                                "name": "Science & Nature"
                            },
                            {
                                "id": 18,
                                "name": "Science: Computers"
                            },
                            {
                                "id": 19,
                                "name": "Science: Mathematics"
                            },
                            {
                                "id": 20,
                                "name": "Mythology"
                            },
                            {
                                "id": 21,
                                "name": "Sports"
                            },
                            {
                                "id": 22,
                                "name": "Geography"
                            },
                            {
                                "id": 23,
                                "name": "History"
                            },
                            {
                                "id": 24,
                                "name": "Politics"
                            },
                            {
                                "id": 25,
                                "name": "Art"
                            },
                            {
                                "id": 26,
                                "name": "Celebrities"
                            },
                            {
                                "id": 27,
                                "name": "Animals"
                            },
                            {
                                "id": 28,
                                "name": "Vehicles"
                            },
                            {
                                "id": 29,
                                "name": "Entertainment: Comics"
                            },
                            {
                                "id": 30,
                                "name": "Science: Gadgets"
                            },
                            {
                                "id": 31,
                                "name": "Entertainment: Japanese Anime & Manga"
                            },
                            {
                                "id": 32,
                                "name": "Entertainment: Cartoon & Animations"
                            }
                        ]
                    },
                    sortRank: 4,
                    showBottomHr: false,
                    validation: {
                        required: true
                    }
                },
                enabledDifficulties: {
                    type: "multiselect",
                    title: "API Enabled Difficulties",
                    default: ["easy", "medium", "hard"],
                    description: "Difficulties of questions that are enabled when using the API.",
                    tip: "You need at least one difficulty selected for the API source to work.",
                    settings: {
                        options: [
                            {
                                id: "easy",
                                name: "Easy"
                            },
                            {
                                id: "medium",
                                name: "Medium"
                            },
                            {
                                id: "hard",
                                name: "Hard"
                            }
                        ]
                    },
                    sortRank: 5,
                    showBottomHr: false,
                    validation: {
                        required: true
                    }
                },
                enabledTypes: {
                    type: "multiselect",
                    title: "API Enabled Question Types",
                    default: ["multiple", "boolean"],
                    description: "Types of questions that are enabled when using the API.",
                    tip: "You need at least one type selected for the API source to work.",
                    settings: {
                        options: [
                            {
                                id: "boolean",
                                name: "True/False"
                            },
                            {
                                id: "multiple",
                                name: "Multiple Choice"
                            }
                        ]
                    },
                    sortRank: 6,
                    showBottomHr: false,
                    validation: {
                        required: true
                    }
                }
            }
        },
        gameplaySettings: {
            title: 'Gameplay Settings',
            description: 'Settings related to gameplay.',
            sortRank: 3,
            settings: {
                answerSortOrder: {
                    type: "enum",
                    title: "Answer Sort Order",
                    description: "How to sort the multiple choice answers.",
                    tip: "",
                    default: 'Random',
                    options: ["Alphabetical", "Random"],
                    sortRank: 1,
                    showBottomHr: true,
                    validation: {
                        required: true
                    }
                },
                timeLimit: {
                    type: "number",
                    title: "Time Limit",
                    description: "The amount of time (in seconds) to answer a question.",
                    tip: "in seconds",
                    default: 30,
                    sortRank: 2,
                    showBottomHr: true,
                    validation: {
                        required: true,
                        min: 1
                    }
                },
                permitAnswerChange: {
                    type: "boolean",
                    title: "Permit Answer Change",
                    description: "Whether to allow players to change their answer to a question.",
                    tip: "Check the box to allow players to change their answer before the timer expires.",
                    default: true,
                    sortRank: 3,
                    showBottomHr: true,
                    validation: {
                        required: true
                    }
                }
            }
        },
        otherSettings: {
            title: 'Advanced Settings',
            description: 'Fine-tuned customization for advanced users.',
            sortRank: 5,
            settings: {
                confirmationInterval: {
                    type: "number",
                    title: "Answer Confirmation Interval",
                    description: "Time interval (in seconds) between firing TRIVIA_ANSWER_ACCEPTED_EVENT events.",
                    tip: "In seconds",
                    default: 3,
                    sortRank: 1,
                    showBottomHr: true,
                    validation: {
                        required: true,
                        min: 1
                    }
                },
                persistAskedQuestionsToFile: {
                    // The location of this file is automatically set within the
                    // Firebot profile directory since there's no user
                    // interaction with this file.
                    type: "boolean",
                    title: "Persist Used Questions Between Sessions",
                    description: "This will avoid repeating questions even between Firebot restarts.",
                    tip: "Applies only to the File source.",
                    default: true,
                    sortRank: 2,
                    showBottomHr: true,
                    validation: {
                        required: true
                    }
                },
                recycleQuestions: {
                    type: "boolean",
                    title: "Recycle Questions",
                    description: "Whether to start re-asking questions from the source file once all questions have been asked.",
                    tip: "Applies only to the File source.",
                    default: true,
                    sortRank: 4,
                    showBottomHr: true,
                    validation: {
                        required: true
                    }
                }
            }
        }
    };
}
