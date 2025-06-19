import { registerConditions } from './conditions';
import { registerEffects } from './effects';
import { TriviaGameEvents } from './events';
import { registerEventFilters } from './filters';
import { FirebotManager, logger } from './firebot';
import { GameManager } from './game';
import { getQuestionManager, QuestionManager } from './questions/common';
import { registerReplaceVariables } from './variables';

export let triviaGame: TriviaGame;

const usedQuestionsFile = 'used-questions.json';
const usedQuestionsPath = `script-data/firebot-mage-trivia/${usedQuestionsFile}`; // Old path for compatibility
declare const SCRIPTS_DIR: string; // Old method for compatibility

export class TriviaGame {
    private gameManager: GameManager;
    private firebotManager: FirebotManager;
    private questionManager!: QuestionManager;
    private triviaGameEvents: TriviaGameEvents;

    constructor(firebotManager: FirebotManager) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        triviaGame = this;
        this.firebotManager = firebotManager;
        this.gameManager = new GameManager(this);
        this.triviaGameEvents = new TriviaGameEvents(this);
    }

    public getGameManager(): GameManager {
        return this.gameManager;
    }

    public getFirebotManager(): FirebotManager {
        return this.firebotManager;
    }

    public getUsedQuestionCachePath(): string {
        const path = this.getFirebotManager().getModules().path;
        try {
            // Requires a version of Firebot that exposes the profile manager.
            // See https://github.com/crowbartools/Firebot/issues/3180
            const { path, scriptDataDir } = this.getFirebotManager().getModules();
            const result = path.join(scriptDataDir, usedQuestionsFile);
            logger('debug', `Got used question persistence path from scriptDataDir: ${scriptDataDir}`);
            return result;
        } catch (error) {
            // Fall back to the legacy method, compatible with older versions of Firebot.
            const profileDirectory = path.join(SCRIPTS_DIR, '..');
            const usedQuestionsPathSplit = usedQuestionsPath.split('/');
            const result = path.join(profileDirectory, ...usedQuestionsPathSplit);
            logger('debug', `Got used question persistence path from legacy method: ${result} (error: ${error})`);
            return result;
        }
    }

    public getQuestionManager(): QuestionManager {
        return this.questionManager;
    }

    public async onLoad(): Promise<void> {
        registerConditions(this);
        registerEffects(this);
        registerEventFilters(this);
        this.triviaGameEvents.registerEvents();
        registerReplaceVariables(this);
    }

    public async onUnload(): Promise<void> {
        // Nothing as of now
    }

    public async onSettingsUpdate(): Promise<void> {
        this.initializeQuestionManager();
        await this.getQuestionManager().initializeQuestions();
    }

    public initializeQuestionManager(): void {
        this.questionManager = getQuestionManager(this);
    }
}
