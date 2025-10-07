import { Trigger } from '@crowbartools/firebot-custom-scripts-types/types/triggers';
import { ErrorMetadata, TRIVIA_EVENT_SOURCE_ID, TriviaEvent } from '../events';
import { logger } from '../firebot';
import { triviaGame } from '../globals';

export enum ErrorType {
    CRITICAL_ERROR = 'Critical Error',
    RUNTIME_ERROR = 'Runtime Error',
}

export function reportError(errorType: ErrorType, fullErrorMessage: string, safeErrorMessage: string, trigger?: Trigger): void {
    // Full message is not always set.
    const loggedMessage = fullErrorMessage ? `${safeErrorMessage} ${fullErrorMessage}` : safeErrorMessage;
    const metadata: ErrorMetadata = {
        safeMessage: safeErrorMessage,
        message: fullErrorMessage,
        trigger: trigger
    };
    logger('debug', `Reporting error: ${loggedMessage} with metadata: ${JSON.stringify(metadata)}`);

    if (errorType === ErrorType.CRITICAL_ERROR) {
        logger('error', `Critical error occurred: ${loggedMessage}`);
        triviaGame.getFirebotManager().emitEvent(TRIVIA_EVENT_SOURCE_ID, TriviaEvent.ERROR_CRITICAL, metadata, false);
    } else if (errorType === ErrorType.RUNTIME_ERROR) {
        logger('warn', `Runtime error occurred: ${loggedMessage}`);
        triviaGame.getFirebotManager().emitEvent(TRIVIA_EVENT_SOURCE_ID, TriviaEvent.ERROR_RUNTIME, metadata, false);
    }
}
