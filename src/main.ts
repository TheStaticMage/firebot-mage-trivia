import { Firebot } from '@crowbartools/firebot-custom-scripts-types';
import { TRIVIA_GAME_ID, TRIVIA_GAME_NAME } from './constants';
import { FirebotManager } from './firebot';
import { TriviaGame } from './globals';
import { gameSettings } from './settings';

const scriptVersion = '0.0.2';

const script: Firebot.CustomScript<object> = {
    getScriptManifest: () => {
        return {
            name: 'Mage Trivia Game',
            description: 'A chat based multiplayer trivia game.',
            author: 'TheStaticMage',
            version: scriptVersion,
            firebotVersion: '5'
        };
    },
    getDefaultParameters: () => {
        return {};
    },
    run: async (runRequest) => {
        // Set our run request variable for use throughout the app.
        const firebotManager = new FirebotManager(runRequest);

        // Instantiate components.
        const triviaGame = new TriviaGame(firebotManager);

        // Register the game in Firebot.
        firebotManager.registerGame({
            id: TRIVIA_GAME_ID,
            name: TRIVIA_GAME_NAME,
            subtitle: 'A chat based multiplayer trivia game.',
            description: 'Allow your viewers to earn currency by answering multiple-choice questions.',
            icon: 'fa-solid fa-question',
            settingCategories: gameSettings(),
            onLoad: async () => {
                await triviaGame.onLoad();
            },
            onUnload: async () => {
                await triviaGame.onUnload();
            },
            onSettingsUpdate: async () => {
                await triviaGame.onSettingsUpdate();
            }
        });

        // Initializing the questions must happen after the game is registered.
        triviaGame.initializeQuestionManager();
        await triviaGame.getQuestionManager().initializeQuestions();
    }
};

export default script;
