import { RunRequest, ScriptModules } from '@crowbartools/firebot-custom-scripts-types';
import { Effects } from '@crowbartools/firebot-custom-scripts-types/types/effects';
import { ConditionType } from '@crowbartools/firebot-custom-scripts-types/types/modules/condition-manager';
import { EventFilter } from '@crowbartools/firebot-custom-scripts-types/types/modules/event-filter-manager';
import { EventSource } from '@crowbartools/firebot-custom-scripts-types/types/modules/event-manager';
import { FirebotGame } from '@crowbartools/firebot-custom-scripts-types/types/modules/game-manager';
import { ReplaceVariable } from '@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager';
import { TwitchApi } from '@crowbartools/firebot-custom-scripts-types/types/modules/twitch-api';
import { UserDb } from '@crowbartools/firebot-custom-scripts-types/types/modules/user-db';
import { TRIVIA_GAME_ABBR, TRIVIA_GAME_ID } from './constants';
import { triviaGame } from './globals';
import { GameSettings } from './settings';

export class FirebotManager {
    private firebot: RunRequest<any>;

    constructor(runRequest: RunRequest<any>) {
        this.firebot = runRequest;
    }

    public setFirebot(firebotRequest: RunRequest<any>): void {
        this.firebot = firebotRequest;
    }

    public async adjustCurrencyForUser(amount: number, username: string) {
        const { currencyDb } = this.firebot.modules;
        const gameSettings = this.getGameSettings();
        const { currencyId } = gameSettings.currencySettings;

        await currencyDb.adjustCurrencyForUser(
            username,
            currencyId,
            amount,
            'adjust'
        );
    }

    public emitEvent(
        sourceId: string,
        eventId: string,
        meta: Record<string, unknown>,
        isManual?: boolean
    ): void {
        this.logger('debug', `Emitting event: ${eventId} from source: ${sourceId} with metadata: ${JSON.stringify(meta)}`);

        const { eventManager } = this.firebot.modules;
        eventManager.triggerEvent(sourceId, eventId, meta, isManual);
    }

    public getCurrencyName(): string {
        const { currencyDb } = this.firebot.modules;
        const gameSettings = this.getGameSettings();
        const { currencyId } = gameSettings.currencySettings;

        const currency = currencyDb.getCurrencyById(currencyId);
        return currency ? currency.name : 'currency';
    }

    public getGameSettings(): GameSettings {
        const { gameManager } = this.firebot.modules;
        const settings = gameManager.getGameSettings(TRIVIA_GAME_ID);
        return settings.settings as GameSettings;
    }

    public getStreamerUsername(): string {
        return this.firebot.firebot.accounts.streamer.username;
    }

    public async getUserCurrencyTotal(username: string): Promise<number> {
        const { currencyDb } = this.firebot.modules;
        const gameSettings = this.getGameSettings();
        const { currencyId } = gameSettings.currencySettings;
        const currencyTotal = await currencyDb.getUserCurrencyAmount(
            username,
            currencyId
        );
        return currencyTotal;
    }

    public logger(type: string, message: string): void {
        const fblogger = this.firebot.modules.logger;

        switch (type) {
            case 'debug':
                fblogger.debug(`${TRIVIA_GAME_ABBR}: ${message}`);
                break;
            case 'error':
                fblogger.error(`${TRIVIA_GAME_ABBR}: ${message}`);
                break;
            case 'warn':
                fblogger.warn(`${TRIVIA_GAME_ABBR}: ${message}`);
                break;
            default:
                fblogger.info(`${TRIVIA_GAME_ABBR}: ${message}`);
        }
    }

    public registerConditionType(conditionType: ConditionType<any, any, any>): void {
        const { conditionManager } = this.firebot.modules;
        conditionManager.registerConditionType(conditionType);
    }

    public registerEffect(effect: Effects.EffectType<object>): void {
        const { effectManager } = this.firebot.modules;
        effectManager.registerEffect(effect);
    }

    public registerEventSource(eventSource: EventSource): void {
        const { eventManager } = this.firebot.modules;
        eventManager.registerEventSource(eventSource);
    }

    public registerEventFilter(eventFilter: EventFilter): void {
        const { eventFilterManager } = this.firebot.modules;
        eventFilterManager.registerFilter(eventFilter);
    }

    public registerReplaceVariable(replaceVariable: ReplaceVariable): void {
        const { replaceVariableManager } = this.firebot.modules;
        replaceVariableManager.registerReplaceVariable(replaceVariable);
    }

    public registerGame(gameDefinition: FirebotGame): void {
        const { gameManager } = this.firebot.modules;
        gameManager.registerGame(gameDefinition);
    }

    public getTwitchApi(): TwitchApi {
        const { twitchApi } = this.firebot.modules;
        return twitchApi;
    }

    public getUserDb(): UserDb {
        const { userDb } = this.firebot.modules;
        return userDb;
    }

    public getModules(): ScriptModules {
        return this.firebot.modules;
    }
}

export function logger(type: string, message: string): void {
    triviaGame.getFirebotManager().logger(type, message);
}
