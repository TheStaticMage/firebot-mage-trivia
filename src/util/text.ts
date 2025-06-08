/**
 * Formats a given time in seconds into a human-readable string.
 * @param seconds - The time in seconds.
 * @returns A formatted time string.
 */
export function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (minutes === 0 && remainingSeconds === 0) {
        return '0 seconds';
    }

    if (minutes === 0) {
        return remainingSeconds === 1 ? '1 second' : `${remainingSeconds.toString()} seconds`;
    }

    if (remainingSeconds === 0) {
        return minutes === 1 ? '1 minute' : `${minutes.toString()} minutes`;
    }

    return `${minutes.toString()}m ${remainingSeconds.toString()}s`;
}

/**
 * Joins an array of strings with commas and "and" before the last item.
 * @param items - The array of strings to join.
 * @returns A string joined with commas and "and".
 */
export function joinWithAnd(items: string[]): string {
    if (items.length === 0) {
        return '';
    } else if (items.length === 1) {
        return items[0];
    } else if (items.length === 2) {
        return `${items[0]} and ${items[1]}`;
    }
    const lastItem = items.pop() ?? '';
    return `${items.join(', ')}, and ${lastItem}`;

}

/**
 * Joins an array of strings with commas and "or" before the last item.
 * @param items - The array of strings to join.
 * @returns A string joined with commas and "or".
 */
export function joinWithOr(items: string[]): string {
    if (items.length === 0) {
        return '';
    } else if (items.length === 1) {
        return items[0];
    } else if (items.length === 2) {
        return `${items[0]} or ${items[1]}`;
    }
    const lastItem = items.pop() ?? '';
    return `${items.join(', ')}, or ${lastItem}`;

}

/**
 * Removes a space followed by an invisible Unicode character at the end of a
 * string. Chatterino does this as part of its duplicate message workaround.
 * @param {string} str - The input string to clean
 * @returns {string} - The cleaned string
 */
export function stripTrailingInvisibleCharacters(str: string): string {
    // Common invisible Unicode characters
    const invisibleChars = [
        '\u200B', // Zero-width space
        '\u200C', // Zero-width non-joiner
        '\u200D', // Zero-width joiner
        '\uFEFF', // Zero-width no-break space
        '\u2060', // Word joiner
        '\u180E', // Mongolian vowel separator
        '\u061C', // Arabic letter mark
        '\uDB40' // High surrogate
    ];

    // Check if string ends with space + invisible character
    for (const char of invisibleChars) {
        if (str.endsWith(` ${char}`)) {
            return str.slice(0, -2);
        }
    }

    // If no specific invisible character is matched, try a more general approach
    // This regex matches a space followed by any character that has no visual representation
    return str.replace(/\s[\p{Control}\p{Format}\p{Surrogate}\p{Unassigned}]$/u, '');
}
