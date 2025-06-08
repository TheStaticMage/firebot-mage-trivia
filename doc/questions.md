# Question Curation Guide

## Introduction

Mage Trivia currently supports two question sources:

- Open Trivia Database (<https://opentdb.com/>) with configurable categories and difficulties
- A local question source that you curate yourself

Curating a local question source can take considerable effort, but this gives you absolute control over the questions and answers. This also allows you to "theme" your trivia questions. The Mage Trivia game is currently used by its original author with over 300 hand-curated cat trivia questions. :cat:

## Creating the Question File

Your trivia questions must be written in a YAML file. To demonstrate the format, here are the first two questions in my "cat trivia" question bank.

```yaml
- questionText: What is the proper term for a group of kittens?
  knewIt: "that a group of kittens is called a kindle"
  answers:
    - answerText: Kindle
      isCorrect: true
    - answerText: Kettle
      isCorrect: false
    - answerText: Kaboodle
      isCorrect: false
    - answerText: Kinder
      isCorrect: false
- questionText: A human has 650 skeletal muscles, while a cat has about ...?
  answers:
    - answerText: 100
      isCorrect: false
    - answerText: 250
      isCorrect: false
    - answerText: 500
      isCorrect: true
    - answerText: 750
      isCorrect: false
```

This file parses down to a list of "question objects" where each question object has the following schema:

```typescript
{
    questionText: string;
    knewIt?: string;
    answers: {
        answerText: string;
        isCorrect: boolean;
    }[];
}
```

Here is the meaning of each field:

| Parameter | Type | Required? | Description |
| --- | --- | --- | --- |
| `questionText` | string | REQUIRED | The text of the question. You should include the question mark or other punctuation as part of the question text. |
| `knewIt` | string | Optional | The completion of a sentence like: "TheStaticMage won 100 cat treats because they knew _____." (This is currently unimplemented but planned.) |
| `answers.answerText` | string | REQUIRED | The text of a multiple-choice answer. |
| `answers.isCorrect` | boolean | REQUIRED | Whether this is a correct answer. |

Notes:

- When editing YAML files, indentation is meaningful, and spaces and tabs are not interchangeable. Incorrect indentation can lead to some or all of the file being unparseable.

    - I suggest using a code editor (e.g. [Visual Studio Code](https://code.visualstudio.com/)) instead of a simple text editor like Nodepad.

    - You can download and use [cat-trivia.yaml](/misc/question-file/cat-trivia.yaml) as a template for your own question file.

- Do NOT include a letter as part of the `answerText` because the program will automatically add the letters. Notice how nne of the examples say something like `answerText: (A) Kindle`.

- The answer if your answers is not important. The program will sort the answer choices randomly or alphabetically depending on how you configure this in the [settings](/doc/reference/settings.md).

- You must have at least one answer marked as correct (`isCorrect: true`). If there are no correct answers, the question will not be loaded.

- You can have multiple correct answers for a given question. If there are multiple correct answers, a user will "win" by guessing _any_ of the correct answers.

- Technically speaking, `answerText` can end up being defined in YAML as a string, number, boolean, etc. It will be converted internally into a string. The second example question above has numeric answers, but it was not necessary to put quotation marks around them to force them to be strings.

- I have found that GitHub CoPilot (an AI coding tool) picks up on the format quickly and often suggest answers -- many times getting things correct. For a coding tool it has an impressive amount of cat knowledge. But it is not always correct, and sometimes it makes up random facts of its own. If you use an AI tool to help with your question file, be sure to verify its suggestions.

## Using the Question File

Create a file using the format above. This file can be named anything you want and put in any directory you want.

Once you've done this, configure it within Firebot as follows:

1. Go to Games &gt; Mage Trivia &gt; and click "Edit" to open the settings.

2. Expand the "Trivia Data Settings" section.

3. For Trivia Source, select File.

4. For Trivia Source File, use the file picker to select your questions file.

5. Click the "Save" button.

Now, if you create a game, the question will come from your question file.

## Updating the Question File

The question file is read whenever:

- Firebot starts up
- The settings for Games &gt; Mage Trivia are saved

If you edit the file while Firebot is not running, there's nothing special that you need to do. The file will be loaded the next time Firebot starts.

If you edit the file while Firebot is running, the questions will NOT be re-loaded automatically. To force it to reload the question file, just save the settings in Games &gt; Mage Trivia, even if you don't change anything.

## Question Persistence and Recycling

Mage Trivia avoids re-asking the same question by keeping track of which questions it has already asked. This is called the "used question cache." There are two settings that give finer control over this behavior, both of which are found under Games &gt; Mage Trivia &gt; Advanced Settings.

- **Persist Used Questions Between Sessions** (default checked): When checked, the "used question cache" is written to a file to preserve the state even when Firebot is restarted. If you uncheck this, the "used question cache" is stored in memory only, and it will be forgotten when you restart Firebot. Most people will want to leave this checked to avoid re-asking questions between streams.

- **Recycle Questions** (default checked): This setting controls what happens when all of the questions in the question file have been asked. When checked, the "used question cache" will reset, making all of the questions eligible to be asked again. If this option is unchecked, an error will be logged when the program has run out of questions, and it will not be possible to ask a new question. Most people will want to leave this checked to ensure smooth operation of the program.

Note: The "used question cache" file is saved in `{firebot profile dir}/firebot-mage-trivia-data/used-questions.json`. This file is not intended to be human readable or editable. If you delete this file, it will be recreated automatically. A separate file is maintained per Firebot profile.

## Error Handling

Any problems reading or parsing the question file:

- Are recorded in Firebot's log
- Trigger the `Critical Error` or `Runtime Error` event depending on severity

Since the Firebot log contains a lot of information and you are not necessarily looking at during a stream, handling the aforementioned events is a better way to get your attention.

Procedure to handle Mage Trivia error events:

1. Go to Events and click "New Event".

2. For "Trigger On" search for and select either `Critical Error (Mage Trivia Events)` or `Runtime Error (Mage Trivia Events)`.

3. Configure the event handler:

    - Name can be whatever you want
    - Filters: there should not be any
    - Settings:
        - [x] Is Enabled
        - [ ] Custom Cooldown

4. Create one or more effects to notify you. These effects should make use of the `$mageTriviaError` variable, which will contain the error message. (You will need to set up separate Events for critical errors and runtime errors.)

In my own setup, I use a chat feed alert to catch my attention in the dashboard.

Effect definition:

![Effect](/doc/img/questions/question-error-effect.png)

Example error display:

![Dashboard](/doc/img/questions/question-error-dashboard.png)
