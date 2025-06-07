import { logger } from '../firebot';
import { ErrorType, reportError } from '../util/errors';
import { Question, QuestionManager } from './common';

export class RemoteQuestionManager extends QuestionManager {
    private sessionToken: string;

    /**
     * Initialize function entrypoint to be overridden by subclasses.
     */
    async initializeQuestions(): Promise<boolean> {
        // We can warn in advance if the source is not set up correctly.
        if (!this.checkSettings()) {
            reportError(
                ErrorType.CRITICAL_ERROR,
                '',
                'Trivia questions cannot be initialized because the settings are misconfigured. You have not selected valid categories, difficulties, or types. Go to Games > Mage Trivia > Trivia Data Settings and configure appropriately.'
            );
            return false;
        }

        // A session token is not strictly necessary, but this prevents the same
        // questions from being asked multiple times.
        const requestUrl = 'https://opentdb.com/api_token.php?command=request';
        this.fetchUrl(requestUrl)
            .then((data: any) => {
                if (data && data.token) {
                    this.sessionToken = data.token;
                    logger('debug', `Session token for trivia questions: ${this.sessionToken}`);
                } else {
                    reportError(
                        ErrorType.CRITICAL_ERROR,
                        `Response code: ${data?.response_code}`,
                        'An API error occurred while fetching the session token.'
                    );
                    return false;
                }
            })
            .catch((error: Error) => {
                reportError(
                    ErrorType.CRITICAL_ERROR,
                    error.message,
                    'An API error occurred while fetching the session token.'
                );
                return false;
            });
        return true;
    }

    /**
     * Get question entrypoint to be overridden by subclasses.
     */
    async getNewQuestion(): Promise<Question | undefined> {
        if (!this.checkSettings()) {
            reportError(
                ErrorType.CRITICAL_ERROR,
                '',
                'Trivia questions cannot be initialized because the settings are misconfigured. You have not selected valid categories, difficulties, or types. Go to Games > Mage Trivia > Trivia Data Settings and configure appropriately.'
            );
            return undefined;
        }

        const settings = this.triviaGame.getFirebotManager().getGameSettings();
        const category = settings.triviaDataSettings.enabledCategories[Math.floor(Math.random() * settings.triviaDataSettings.enabledCategories.length)];
        const difficulty = settings.triviaDataSettings.enabledDifficulties[Math.floor(Math.random() * settings.triviaDataSettings.enabledDifficulties.length)];
        const type = settings.triviaDataSettings.enabledTypes[Math.floor(Math.random() * settings.triviaDataSettings.enabledTypes.length)];
        const requestUrl = `https://opentdb.com/api.php?amount=1&category=${category}&difficulty=${difficulty}&type=${type}&encode=base64&token=${this.sessionToken}`;

        this.fetchUrl(requestUrl)
            .then((data: any) => {
                if (data && data.response_code === 0 && data.results.length > 0) {
                    const result = data.results[0];
                    const question: Question = {
                        questionText: atob(result.question),
                        correctAnswers: Array.isArray(result.correct_answers) ? result.correct_answers : [result.correct_answer],
                        incorrectAnswers: Array.isArray(result.incorrect_answers) ? result.incorrect_answers : [result.incorrect_answer]
                    };
                    // Decode the answers from base64
                    question.correctAnswers = question.correctAnswers.map(answer => atob(answer));
                    question.incorrectAnswers = question.incorrectAnswers.map(answer => atob(answer));
                    return question;
                }
                reportError(
                    ErrorType.CRITICAL_ERROR,
                    `opentdb.com API response code: ${data?.response_code}`,
                    'The API returned an unexpected response while fetching the trivia question.'
                );
                return undefined;

            })
            .catch((error: Error) => {
                reportError(
                    ErrorType.CRITICAL_ERROR,
                    error.message,
                    'An API error occurred while fetching the trivia question.'
                );
                return false;
            });
    }

    /**
     * Check settings
     */
    private checkSettings(): boolean {
        const triviaSettings = this.triviaGame.getFirebotManager().getGameSettings();
        if (triviaSettings.triviaDataSettings.enabledCategories.length === 0 || triviaSettings.triviaDataSettings.enabledDifficulties.length === 0 || triviaSettings.triviaDataSettings.enabledTypes.length === 0) {
            return false;
        }

        return true;
    }

    private fetchUrl(url: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            fetch(url, { signal: controller.signal })
                .then((response) => {
                    clearTimeout(timeoutId);
                    if (!response.ok) {
                        reject(new Error(`HTTP error! status: ${response.status}`));
                    } else {
                        return response.json();
                    }
                })
                .then(data => resolve(data))
                .catch((error) => {
                    if (error.name === 'AbortError') {
                        reject(new Error('Request timed out'));
                    } else {
                        reject(error);
                    }
                });
        });
    }
}