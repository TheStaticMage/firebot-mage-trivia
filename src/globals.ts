import { registerConditions } from './conditions';
import { registerEffects } from './effects';
import { TriviaGameEvents } from './events';
import { registerEventFilters } from './filters';
import { FirebotManager } from './firebot';
import { GameManager } from './game';
import { getQuestionManager, QuestionManager } from './questions/common';
import { registerReplaceVariables } from './variables';

export let triviaGame: TriviaGame;

const usedQuestionsFile = 'used-questions.json';

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
        return path.join(this.getFirebotManager().getScriptDataDir(), usedQuestionsFile);
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
