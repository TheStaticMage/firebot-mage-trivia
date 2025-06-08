import { Logger } from '@crowbartools/firebot-custom-scripts-types/types/modules/logger';

export let firebotLogger: Logger;

export function logger(type: string, message: string): void {
    if (type === 'info') {
        firebotLogger.info(message);
    } else if (type === 'error') {
        firebotLogger.error(message);
    } else if (type === 'warn') {
        firebotLogger.warn(message);
    } else if (type === 'debug') {
        firebotLogger.debug(message);
    }
}
