import { Mutex } from 'async-mutex';
import { createHash } from 'crypto';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as NodeCache from 'node-cache';
import * as path from 'path';
import { logger } from '../firebot';
import { TriviaGame } from '../globals';
import { ErrorType, reportError } from '../util/errors';
import { Question, QuestionManager } from './common';

interface yamlQuestionType {
    questionText: string;
    knewIt?: string;
    answers: yamlQuestionAnswerType[];
}

interface yamlQuestionAnswerType {
    answerText: string;
    isCorrect: boolean;
}

export class LocalQuestionManager extends QuestionManager {
    private mutex: Mutex;
    private fileMutex: Mutex;
    private questionDB: NodeCache;
    private usedQuestionsCache: NodeCache;

    constructor(triviaGame: TriviaGame) {
        super(triviaGame);
        this.questionDB = new NodeCache({ checkperiod: 5 });
        this.usedQuestionsCache = new NodeCache({ checkperiod: 5 });
        this.mutex = new Mutex();
        this.fileMutex = new Mutex();
    }

    /**
     * Initialize the questions from file
     */
    initializeQuestions(): boolean {
        logger('debug', 'Initializing questions.');

        const triviaSettings = this.triviaGame.getFirebotManager().getGameSettings();
        const triviaFile = triviaSettings.triviaDataSettings.triviaFile;

        const questions = this.loadQuestionsFromFile(triviaFile);
        if (!questions) {
            return false;
        }
        logger('debug', `${String(questions.size)} questions have been loaded from the file.`);

        this.questionDB.flushAll();

        questions.forEach((value, key) => {
            this.questionDB.set(key, value);
        });
        logger('debug', `${String(questions.size)} questions have been initialized into the cache.`);

        this.loadUsedQuestions();

        return true;
    }

    /**
     * Get a new random question that hasn't been answered
     */
    async getNewQuestion(): Promise<Question | undefined> {
        let questionKeys = this.questionDB.keys();
        logger('debug', `There are ${String(questionKeys.length)} questions in the database.`);

        if (questionKeys.length === 0 && this.initializeQuestions()) {
            questionKeys = this.questionDB.keys();
            logger('warn', `Reloaded questions from file; there are now ${String(questionKeys.length)} questions in the database.`);
        }

        const answeredQuestions = this.usedQuestionsCache.keys();
        logger('debug', `There are ${String(answeredQuestions.length)} questions that have been answered.`);

        let unansweredQuestions = this.getUnansweredQuestions();
        logger('debug', `There are ${String(unansweredQuestions.length)} questions that have not been answered.`);

        if (questionKeys.length > 0 && unansweredQuestions.length === 0) {
            const settings = this.triviaGame.getFirebotManager().getGameSettings();
            if (settings.otherSettings.recycleQuestions) {
                this.initializeQuestions();
                this.recycleUsedQuestions();
                unansweredQuestions = this.getUnansweredQuestions();
            }
        }

        if (unansweredQuestions.length === 0) {
            reportError(
                ErrorType.CRITICAL_ERROR,
                '',
                'No questions are available to ask. You either need to add more questions to the trivia file or enable the "Recycle Questions" setting.'
            );
            return;
        }

        const randomIndex = Math.floor(Math.random() * unansweredQuestions.length);
        const randomQuestionKey = unansweredQuestions[randomIndex];
        this.markQuestionAsUsed(randomQuestionKey);

        return this.questionDB.get(randomQuestionKey);
    }

    /**
     * Load questions from a YAML file
     */
    private loadQuestionsFromFile(filePath: string): Map<string, Question> | undefined {
        let fileContents: string;
        try {
            fileContents = fs.readFileSync(filePath, 'utf8');
        } catch (error) {
            reportError(
                ErrorType.CRITICAL_ERROR,
                `${filePath}: ${String(error)}`,
                "Error reading trivia file. Please check the file path and ensure it exists."
            );
            return;
        }

        let questions: yamlQuestionType[] = [];
        try {
            questions = yaml.load(fileContents) as yamlQuestionType[];
        } catch (error) {
            reportError(
                ErrorType.CRITICAL_ERROR,
                String(error),
                "Error parsing trivia file. Please check that the file is in the correct format."
            );
            return;
        }

        const file: string = path.basename(filePath, path.extname(filePath));
        const questionMap = new Map<string, Question>();

        questions.forEach((question) => {
            const formattedQuestion: Question = {
                questionText: question.questionText,
                correctAnswers: question.answers.filter((answer: yamlQuestionAnswerType) => answer.isCorrect).map((answer: yamlQuestionAnswerType) => String(answer.answerText)),
                incorrectAnswers: question.answers.filter((answer: yamlQuestionAnswerType) => !answer.isCorrect).map((answer: yamlQuestionAnswerType) => String(answer.answerText))
            };

            if (formattedQuestion.correctAnswers.length === 0) {
                reportError(
                    ErrorType.RUNTIME_ERROR,
                    "",
                    `A question in the trivia file has no correct answers. (${formattedQuestion.questionText}).`
                );
                return;
            }

            const questionSHA = createHash('sha256').update(question.questionText).digest('hex');
            questionMap.set(`${file}-${questionSHA}`, formattedQuestion);
        });

        return questionMap;
    }

    /**
     * Mark a question as used
     * @param questionKey The key of the question to mark as used
     */
    private markQuestionAsUsed(questionKey: string): void {
        this.usedQuestionsCache.set(questionKey, true);
        this.saveUsedQuestions();
    }

    /**
     * Load used questions from the file
     */
    private loadUsedQuestions(): void {
        const settings = this.triviaGame.getFirebotManager().getGameSettings();
        if (!settings.otherSettings.persistAskedQuestionsToFile) {
            return;
        }

        const usedQuestionsFilePath = this.triviaGame.getUsedQuestionCachePath();
        if (usedQuestionsFilePath === '') {
            logger('warn', 'No path for used questions persistence file found. May need to update Firebot. Skipping loading used questions.');
            return;
        }


        try {
            const usedQuestionsData = fs.readFileSync(usedQuestionsFilePath, 'utf8');
            const usedQuestions = JSON.parse(usedQuestionsData) as string[];
            if (Array.isArray(usedQuestions)) {
                this.usedQuestionsCache.flushAll();
                usedQuestions.forEach((questionKey: string) => {
                    this.usedQuestionsCache.set(questionKey, true);
                });
                logger('debug', `Loaded ${String(usedQuestions.length)} used questions from ${usedQuestionsFilePath}.`);
            } else {
                logger('warn', `Used questions file (${usedQuestionsFilePath}) is not an array. No questions loaded.`);
            }
        } catch (error) {
            logger('warn', `Used questions file (${usedQuestionsFilePath}) could not be read. No questions loaded. ${String(error)}`);
        }
    }

    /**
     * Save the used questions to a file
     */
    private saveUsedQuestions(): void {
        const settings = this.triviaGame.getFirebotManager().getGameSettings();
        if (!settings.otherSettings.persistAskedQuestionsToFile) {
            return;
        }

        const usedQuestionsFilePath = this.triviaGame.getUsedQuestionCachePath();
        if (usedQuestionsFilePath === '') {
            logger('warn', 'No path for used questions persistence file found. May need to update Firebot. Skipping saving used questions.');
            return;
        }

        try {
            const usedQuestionsFileDir = path.dirname(usedQuestionsFilePath);
            if (!fs.existsSync(usedQuestionsFileDir)) {
                fs.mkdirSync(usedQuestionsFileDir);
                logger('debug', `Created directory for used questions file: ${usedQuestionsFileDir}`);
            }

            const usedQuestions = this.usedQuestionsCache.keys();
            fs.writeFileSync(usedQuestionsFilePath, JSON.stringify(usedQuestions, null, 2));
            logger('debug', `Saved ${String(usedQuestions.length)} used questions to ${usedQuestionsFilePath}.`);
        } catch (error) {
            reportError(
                ErrorType.CRITICAL_ERROR,
                `Error saving used questions file: ${usedQuestionsFilePath}: ${String(error)}`,
                'An error occurred while saving the used questions file.'
            );
        }
    }

    /**
     * Recycle used questions by flushing the cache and saving the state
     */
    private recycleUsedQuestions(): void {
        logger('info', 'Recycling used questions.');
        this.usedQuestionsCache.flushAll();
        this.saveUsedQuestions();
    }

    /**
     * Get the list of unanswered questions
     */
    private getUnansweredQuestions(): string[] {
        const questionKeys = this.questionDB.keys();
        const answeredQuestions = this.usedQuestionsCache.keys();

        return questionKeys.filter((questionKey) => {
            return !answeredQuestions.includes(questionKey);
        });
    }
}
