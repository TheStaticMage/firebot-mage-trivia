import { registerConditions } from './conditions';
import { registerEffects } from './effects';
import { TriviaGameEvents } from './events';
import { registerEventFilters } from './filters';
import { FirebotManager, logger } from './firebot';
import { GameManager } from './game';
import { getQuestionManager, QuestionManager } from './questions/common';
import { registerReplaceVariables } from './variables';

declare const SCRIPTS_DIR: string;

export let triviaGame: TriviaGame;

const usedQuestionsPath = 'firebot-mage-trivia-data/used-questions.json';

export class TriviaGame {
    private gameManager: GameManager;
    private firebotManager: FirebotManager;
    private questionManager: QuestionManager;
    private triviaGameEvents: TriviaGameEvents;

    constructor(firebotManager: FirebotManager) {
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
            const { profileManager } = this.getFirebotManager().getModules();
            const result = profileManager.getPathInProfile(usedQuestionsPath);
            logger('debug', `Got used question persistence path from profile manager: ${result}`);
            return result;
        } catch (error) {
            // Fall back to the alternate method if the above fails
            const profileDirectory = path.join(SCRIPTS_DIR, '..');
            const usedQuestionsPathSplit = usedQuestionsPath.split('/');
            const result = path.join(profileDirectory, ...usedQuestionsPathSplit);
            logger('debug', `Got used question persistence path from alternate method: ${result} (error: ${error})`);
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
