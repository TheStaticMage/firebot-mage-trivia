# Reference: Settings

The settings for Mage Trivia are accessed through Firebot via Games &gt; Mage Trivia.

- [Currency Settings](#currency-settings)
    - [Currency](#currency)
    - [Incorrect Answer Penalty](#incorrect-answer-penalty)
    - [Correct Answer Payout](#correct-answer-payout)
    - [Initial Time Bonus and Time Bonus Decay Factor](#initial-time-bonus-and-time-bonus-decay-factor)
    - [Allow Insufficient Balance](#allow-insufficient-balance)
    - [Dry Run Mode](#dry-run-mode)
- [Trivia Data Settings](#trivia-data-settings)
    - [Trivia Source](#trivia-source)
    - [Trivia Source File](#trivia-source-file)
    - [API Enabled Categories](#api-enabled-categories)
    - [API Enabled Difficulties](#api-enabled-difficulties)
    - [API Enabled Question Types](#api-enabled-question-types)
- [Gameplay Settings](#gameplay-settings)
    - [Answer Sort Order](#answer-sort-order)
    - [Time Limit](#time-limit)
    - [Permit Answer Change](#permit-answer-change)
- [Advanced Settings](#advanced-settings)
    - [Answer Confirmation Interval](#answer-confirmation-interval)
    - [Persist Used Questions Between Sessions](#persist-used-questions-between-sessions)
    - [Recycle Questions](#recycle-questions)

## Currency Settings

### Currency

Select the currency that Mage Trivia will use for the game.

In order to use Mage Trivia, you must have created a currency in Firebot. You may use Mage Trivia with an existing currency, or you may create a dedicated currency only for use with Mage Trivia.

If you have not created a currency yet, you can do so via Currency &gt; Add Currency.

### Incorrect Answer Penalty

The amount of currency to subtract for a wrong answer to a question.

If you set this to 0, then no currency is subtracted for an incorrect answer. This setting can be used to encourage everyone to guess, which will increase activity in your chat. However, this also increases the ability for your users to profit without risk.

Notes:

- If you have enabled the ability for users to change their answers, this penalty applies only if the last answer was incorrect. This penalty is _not_ assessed for each incorrect answer that the user might have given along the way, and it is _not_ assessed at all of the user's last answer was correct.

- A non-zero setting can cause certain users not to be able to play the game. See [Allow Insufficient Balance](#allow-insufficient-balance) for further explanation.

### Correct Answer Payout

The amount of currency to award for a correct answer to a question. Any player who answers the question correctly within the time period will receive this payout.

Notes:

- If you configure both a correct answer payout and time-based payout (in next settings), _both_ of these are paid out in one lump-sum award when the question ends.

- If you have enabled the ability for users to change their answers, this payout only applies if their last answer was correct. If the user had the correct answer at some point and then changed their answer to an incorrect one, they do not receive any payout.

- Internally, Mage Trivia immediately dedicts the "incorrect answer penalty" when a user first answers the question to ensure they have sufficient currency. This is _automatically_ returned to the user _in addition to_ the correct answer payout. Therefore, you do _not_ need to concern yourself with "refunding" the incorrect answer penalty as part of the correct answer payout.

### Initial Time Bonus and Time Bonus Decay Factor

These settings enable a bonus currency winnings for faster responses.

`Initial Time Bonus` is the maximum bonus currency that can be awarded. If a user somehow answered the question correctly, instantly, they would receive this amount.

`Decay Factor` controls how quickly the time bonus decays as time goes on. A decay factor of 1 reduces the initial time bonus in a "linear" fashion (at a consistent rate) as time proceeds. Decay Factors greater than 1 tend to front-load the bonus, disproportionately rewarding faster answers the larger the number gets. The recommend Decay Factor is between 1 and 3.

Example payouts (30 second timer, Initial Time Bonus of 100, correct answers as indicated):

| DecayFactor | 1 second | 5 seconds | 15 seconds | 25 seconds |
| ---- | --- | --- | --- | --- |
|  1.0 | 97 | 83 | 50 | 17 |
|  1.5 | 95 | 76 | 35 | 7 |
|  2.0 | 93 | 69 | 25 | 3 |
|  2.5 | 92 | 63 | 18 | 1 |
|  3.0 | 90 | 58 | 13 | 0 |
|  5.0 | 84 | 40 | 3 | 0 |
| 10.0 | 71 | 16 | 0 | 0 |

For the mathematically-inclined, bonus currency is based on this formula:

```
bonus = (InitialTimeBonus) * ((1 - (AnswerTime / TotalTime)) ^ DecayFactor)
```

### Allow Insufficient Balance

When this box is unchecked, if the user does not have enough currency to cover the _Incorrect Answer Penalty_, they will not be allowed to play.

When this box is checked, if the user does not have enough currency to cover the _Incorrect Answer Penalty_, they will still be allowed to play. The game will not make their overall currency go negative if they answer incorrectly.

Examples (Incorrect Answer Penalty = 10, Correct Answer Payout = 50, no time bonus):

| This Box | Answer | Starting $ | Adjustment $ | New Balance $ |
| --- | --- | --- | --- | --- |
| Checked | Correct | 25 | +50 | 75 |
| Checked | Incorrect | 25 | -10 | 15 |
| Checked | Correct | 5 | +50 | 75 |
| Checked | Incorrect | 5 | -5 | 0 |
| Checked | Correct | 0 | +50 | 50 |
| Checked | Incorrect | 0 | -0 | 0 |

| This Box | Answer | Starting $ | Adjustment $ | New Balance $ |
| --- | --- | --- | --- | --- |
| Not Checked | Correct | 25 | +50 | 75 |
| Not Checked | Incorrect | 25 | -10 | 15 |
| Not Checked | -CANNOT PLAY- | 5 | n/a | 5 |
| Not Checked | -CANNOT PLAY- | 5 | n/a | 5 |

Notes:

- If a user is not allowed to play, the [Answer Rejected](/doc/reference/events.md#answer-rejected) event will fire, and the [`$mageTriviaAnswerRejected`](/doc/reference/variables.md#magetriviaanswerrejected) and [`$mageTriviaAnswerRejectedRaw`](/doc/reference/variables.md#magetriviaanswerrejectedraw) variables will be set.

- The user's payout is not affected by whether or not the user had enough currency to cover the Incorrect Answer Penalty. The tradeoff to enabling this setting is that a user can win the same amount as other players even though they had less currency "at risk."

## Dry Run Mode

When enabled, the plugin will not actually adjust user currency. Instead, it will track what adjustments would be made and make them available via the [`$mageTriviaCurrencyAdjustments`](/doc/reference/variables.md#magetriviacurrencyadjustments) replace variable.

This is useful if you want to:

- Review currency adjustments before applying them
- Apply currency adjustments manually through a different system
- Test the trivia game without affecting user balances

Note: All game events and other functionality continue to work normally in dry run mode. The only difference is that currency adjustments are not applied to user balances.

## Trivia Data Settings

### Trivia Source

Mage Trivia supports two sources of trivia questions:

- File: A local file with [questions that you curate yourself](/doc/questions.md)
- API: <https://opentdb.com/>

Use this selector to choose the trivia source you want to use. Then, configure the selected trivia source with the appropriate options below.

### Trivia Source File

Applicability: Trivia Source = File

Use the file picker to choose the [trivia file](/doc/questions.md#using-the-question-file) that you created.

If you have an invalid or unreadable file selected, or if you do not select a file at all, then the trivia program cannot generate a new question.

### API Enabled Categories

Applicability: Trivia Source = API

Select the category or categories that you want included in your trivia. You must select at least one category. The program will choose randomly from these categories when generating a new question.

### API Enabled Difficulties

Applicability: Trivia Source = API

Select the difficulty level or difficulty levels that you want included in your trivia. You must select at least one difficulty level.

### API Enabled Question Types

Applicability: Trivia Source = API

Select whether you want multiple choice, true/false, or both types of questions. You must select at least one.

## Gameplay Settings

### Answer Sort Order

Select the sorting for multiple choice answers between:

- Random: The order of the multiple choice answers will be randomized each time the question is asked. The answers will be in no particular order. This can prevent users from memorizing the answer to a particular question (e.g. "the answer to the question about whiskers is C").

- Alphabetical: The multiple choice answers will be sorted alphabetically (and numerically). This means that the answers will appear in the same order each time the question is asked.

Regardless of which sort method you choose, the program will always do the following:

- Answers starting with "None of" will always be moved to the end.

- "True" will always appear before "False". (For true/false questions, true will always be "A" and false will always be "B".)

### Time Limit

The amount of time (in seconds) to answer a question.

### Permit Answer Change

Check the box to allow players to change their answer before the timer expires.

If this box is checked and the user answers multiple times, the most recent answer will be counted. If the user's last answer is incorrect, they are assessed the incorrect answer penalty. If their lsat answer is correct, they receive the payout and any time-based payout. For scoring purposes, the time at which the last answer was provided will be used for any time bonus.

If this box is unchecked and the user answers multiple times, only their first answer will be considered. In this case, the second and subsequent answer will fire the `Answer Rejected` event. If you choose to trigger an effect, you can use the `$mageTriviaAnswerRejected` variable to report the reason. See [Events](/doc/reference/events.md).

If a user answers the question and then re-answers with the same answer, the repeat answer will be ignored. If their answer is correct, the time at which the user _first_ provided _that_ answer (without changing it to another answer) will be used to calculate the time bonus. For example, assuming "A" is the correct answer:

- If a user answers "A" at 5 seconds, and then types "A" again at 10 seconds, their time bonus will be based on the response at 5 seconds.

- If the user answers "A" at 5 seconds, then "B" at 10 seconds, then "A" at 15 seconds, and then re-types "A" at 20 seconds, their time bonus will be based on the response at 15 seconds.

## Advanced Settings

### Answer Confirmation Interval

To avoid rate limits with the Twitch API, the program does not acknowledge each individual answer with a reply in chat. Rather, it "batches" the users who have answered and sends one acknowledgement on a schedule. It periodically fires the `Answer Accepted Timer Fired` event while the question is in progress. You are able to control the frequency of that event with this setting.

This only has a practical effect if you are handling the `Answer Accepted Timer Fired` event. You can find suggestions for that on the [Events](/doc/reference/events.md) page.

### Persist Used Questions Between Sessions

This setting only applies for Trivia Source = File.

When checked, the "used question cache" is written to a file to preserve the state even when Firebot is restarted. If you uncheck this, the "used question cache" is stored in memory only, and it will be forgotten when you restart Firebot. Most people will want to leave this checked to avoid re-asking questions between streams.

### Recycle Questions

This setting only applies for Trivia Source = File.

This setting controls what happens when all of the questions in the question file have been asked. When checked, the "used question cache" will reset, making all of the questions eligible to be asked again. If this option is unchecked, an error will be logged when the program has run out of questions, and it will not be possible to ask a new question. Most people will want to leave this checked to ensure smooth operation of the program.
