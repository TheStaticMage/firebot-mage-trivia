import { Effects } from '@crowbartools/firebot-custom-scripts-types/types/effects';
import { TRIVIA_EVENT_SOURCE_ID, TriviaEvent } from '../events';
import { logger } from '../firebot';
import { triviaGame } from '../globals';

export enum ErrorType {
    CRITICAL_ERROR = 'Critical Error',
    RUNTIME_ERROR = 'Runtime Error',
}

export function reportError(errorType: ErrorType, errorMessage: string, trigger?: Effects.Trigger): void {
    if (errorType === ErrorType.CRITICAL_ERROR) {
        logger('error', `Critical error occurred: ${errorMessage}`);
        triviaGame.getFirebotManager().emitEvent(TRIVIA_EVENT_SOURCE_ID, TriviaEvent.ERROR_CRITICAL, {
            message: errorMessage,
            trigger: trigger,
        }, false);
    }
    else if (errorType === ErrorType.RUNTIME_ERROR) {
        logger('warn', `Runtime error occurred: ${errorMessage}`);
        triviaGame.getFirebotManager().emitEvent(TRIVIA_EVENT_SOURCE_ID, TriviaEvent.ERROR_RUNTIME, {
            message: errorMessage,
            trigger: trigger,
        }, false);
    }
}
