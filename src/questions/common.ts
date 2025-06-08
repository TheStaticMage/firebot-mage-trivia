import { answerLabels } from '../constants';
import { TriviaGame } from '../globals';
import { ErrorType, reportError } from '../util/errors';

export interface Question {
    questionText: string;
    correctAnswers: string[];
    incorrectAnswers: string[];
}

export interface askedQuestion {
    question: Question;
    answers: string[];
    correctAnswers: number[];
}

export abstract class QuestionManager {
    protected triviaGame: TriviaGame;

    constructor(triviaGame: TriviaGame) {
        this.triviaGame = triviaGame;
    }

    /**
     * Initialize function entrypoint to be overridden by subclasses.
     */
    initializeQuestions(): boolean {
        // This method should be overridden by subclasses to load questions.
        reportError(
            ErrorType.CRITICAL_ERROR,
            '',
            'Trivia game is not correctly configured with a question source. Go to Games > Mage Trivia > Trivia Data Settings and configure appropriately.'
        );
        return false;
    }

    /**
     * Get question entrypoint to be overridden by subclasses.
     */
    // eslint-disable-next-line @typescript-eslint/require-await
    async getNewQuestion(): Promise<Question | undefined> {
        // This method should be overridden by subclasses to return a new question.
        reportError(
            ErrorType.CRITICAL_ERROR,
            '',
            'Trivia game is not correctly configured with a question source. Go to Games > Mage Trivia > Trivia Data Settings and configure appropriately.'
        );
        return undefined;
    }

    /**
     * Prepare a question for display by organizing the answers
     */
    prepareQuestion(question: Question): askedQuestion {
        const triviaSettings = this.triviaGame.getFirebotManager().getGameSettings();

        let answers = question.correctAnswers.concat(question.incorrectAnswers);
        if (triviaSettings.gameplaySettings.answerSortOrder === 'Alphabetical') {
            answers = answers.sort((a, b) => {
                // Numeric sort if possible.
                const aNum = parseFloat(String(a).replace(/,/g, ''));
                const bNum = parseFloat(String(b).replace(/,/g, ''));

                if (!isNaN(aNum) && !isNaN(bNum)) {
                    return aNum - bNum;
                }

                // Random sort otherwise.
                return a.localeCompare(b);
            });
        } else {
            // Shuffle the answers array randomly.
            answers = answers.sort(() => {
                // Random sort
                return Math.random() - 0.5;
            });
        }

        // Common sorting regardless of selected sort order.
        answers = answers.sort((a, b) => {
            // Move "None of these" or equivalent to the end.
            if (String(a).toLowerCase().startsWith('none of ')) {
                return 1;
            }
            if (String(b).toLowerCase().startsWith('none of ')) {
                return -1;
            }

            // For true/false answers, ensure that "True" comes before "False".
            if (String(a).toLowerCase() === 'true' && String(b).toLowerCase() === 'false') {
                return -1;
            }
            if (String(a).toLowerCase() === 'false' && String(b).toLowerCase() === 'true') {
                return 1;
            }
            return 0;
        });

        // Create a map of answers to their correctness status.
        const answerMap = new Map<string, boolean>();
        answers.forEach((answer, index) => {
            answerMap.set(answerLabels[index].toUpperCase(), question.correctAnswers.includes(answer));
        });

        return {
            question: question,
            answers: answers,
            correctAnswers: question.correctAnswers.map(answer => answers.indexOf(answer))
        };
    }
}
