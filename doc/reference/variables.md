# Reference: Variables

- [`$arrayJoinWith`](#arrayjoinwith)
- [`$mageTriviaAnswerAccepted`](#magetriviaansweraccepted)
- [`$mageTriviaAnswerRejected`](#magetriviaanswerrejected)
- [`$mageTriviaAnswerRejectedRaw`](#magetriviaanswerrejectedraw)
- [`$mageTriviaAnswers`](#magetriviaanswers)
- [`$mageTriviaCorrectAnswers`](#magetriviacorrectanswers)
- [`$mageTriviaError`](#magetriviaerror)
- [`$mageTriviaGameInProgress`](#magetriviagameinprogress)
- [`$mageTriviaGameResultsRaw`](#magetriviagameresultsraw)
- [`$mageTriviaPossibleAnswers`](#magetriviapossibleanswers)
- [`$mageTriviaQuestion`](#magetriviaquestion)
- [`$mageTriviaQuestionAndAnswersRaw`](#magetriviaquestionandanswersraw)
- [`$mageTriviaWinners`](#magetriviawinners)
- [`$mageTriviaWinnersWithPoints`](#magetriviawinnerswithpoints)

## `$arrayJoinWith`

#### Description

A utility function that joins an array with commas, and the last element with the provided argument. This one is best understood by looking at the examples.

#### Usage & Examples

`$arrayJoinWith[Array, String] => String`

```
$arrayJoinWith[["A", "B", "C", "D"], "or"]
=> A, B, C or D

$arrayJoinWith[["A", "B"], "and"]
=> A and B

$arrayJoinWith[["A"], "and"]
=> A

$arrayJoinWith[[], "and"]
=> (empty string)
```

This is particularly useful with either `$mageTriviaPossibleAnswers` (letters of the possible trivia answers) and `$mageTriviaWinnersWithPoints` (list of users who answered the trivia question correctly).

```
Chat your answer ($arrayJoinWith[$mageTriviaPossibleAnswers, "or"]) to play!
=> Chat your answer (A, B, C or D) to play!

Congratulations to ($arrayJoinWith[$mageTriviaWinnersWithPoints, "and"])!
=> Congratulations to TheStaticMage (+69), TheStaticBrock (+42) and Firebot (+10)!
```

## `$mageTriviaAnswerAccepted`

#### Description

This is an array of users (with preferred capitalization when possible) who have had answers accepted since the most recent [Answer Accepted Timer Fired](/doc/reference/events.md#answer-accepted-timer-fired) event or the start of the question.

This is commonly used to acknowledge answers in chat (see the example). This is implemented due to rate limits in the Twitch API where sending a chat message to acknowledge each user's response would eventually result in errors, and make the chat very noisy.

#### Usage & Examples

`$mageTriviaAnswerAccepted => Array`

```
$mageTriviaAnswerAccepted
=> ["TheStaticMage", "TheStaticBrock"]
```

This is most commonly used to acknowledge answers in chat when the [Answer Accepted Timer Fired](/doc/reference/events.md#answer-accepted-timer-fired) event is fired.

```
Accepted answers for $arrayJoinWith[$mageTriviaAnswerAccepted, "and"]!
=> Accepted answers for TheStaticMage and TheStaticBrock!
```

#### Notes & Limitations

This variable is only available in the event handler of the [Answer Accepted Timer Fired](/doc/reference/events.md#answer-accepted-timer-fired) event.

The [Answer Accepted Timer Fired](/doc/reference/events.md#answer-accepted-timer-fired) event will _not_ fire when there are no users whose answers have been accepted. Therefore you are assured that there is always at least one element in `$mageTriviaAnswerAccepted`.

## `$mageTriviaAnswerRejected`

#### Description

This is a string indicating the reason that a user's answer was rejected in conjunction with the [Answer Rejected](/doc/reference/events.md#answer-rejected) event.

#### Usage & Examples

`$mageTriviaAnswerRejected => String`

```
$mageTriviaAnswerRejected
=> You have already answered the question
```

#### Notes & Limitations

This variable is only available in the event handler of the [Answer Rejected](/doc/reference/events.md#answer-rejected) event.

## `$mageTriviaAnswerRejectedRaw`

For advanced use cases. [See source code](/src/variables/user-answer.ts)

## `$mageTriviaAnswers`

#### Description

This is an array of answers to the question that is in progress, or if there is no in-progress question, the last question that was asked.

Each element of the array contains the letter and the answer text.

#### Usage & Examples

```
$mageTriviaAnswers => Array

$mageTriviaAnswers
=> ["(A) 50", "(B) 69", "(C) 100", "(D) 420"]
```

This is useful in conjunction with `$arrayJoin` when chatting the possible answers.

```
$arrayJoin[$mageTriviaAnswers, " "]
=> (A) 50 (B) 69 (C) 100 (D) 420
```

#### Notes & Limitations

This variable is available without restriction, but it is only populated when a question is started. If this variable is used before a question has been asked in this Firebot session, an empty array (`[]`) is returned.

## `$mageTriviaCorrectAnswers`

#### Description

This is an array of _correct_ answers to the question in progress, or if there is no in-progress question, the last question that was asked.

Each element of the array contains the letter and the answer text.

#### Usage & Examples

```
$mageTriviaCorrectAnswers => Array

$mageTriviaCorrectAnswers
=> ["(B) 69"]

$mageTriviaCorrectAnswers
=> ["(B) 69", "(D) 420"]
```

Since a trivia question can have multiple correct answers, this is an array and not a string. Therefore, you should almost always use this with `$arrayJoin` or `$arrayJoinWith` or similar when you are using this to post to chat or similar.

```
$arrayJoin[$mageTriviaCorrectAnswers, " "]
=> (B) 69

$arrayJoinWith[$mageTriviaCorrectAnswers, "or"]
=> (B) 69 or (D) 420
```

#### Notes & Limitations

This variable is available without restriction, but it is only populated when a question is started. If this variable is used before a question has been asked in this Firebot session, an empty array (`[]`) is returned.

## `$mageTriviaError`

#### Description

This is a string with the error message from the [Critical Error](/doc/reference/events.md#critical-error) or [Runtime Error](/doc/reference/events.md#runtime-error) event.

#### Usage & Examples

```
// Only when handling Critical Error or Runtime Error
$mageTriviaError => String

$mageTriviaError
=> An error was encountered when reading the question file
```

#### Notes & Limitations

This variable is only available for the _Critial Error_ and _Runtime Error_ events. Firebot will not recognize the variable in other contexts.

Although we do not recommend posting these error messages in chat, this variable will contain only pre-determined messages that will not leak information such as file paths that could dox the streamer.

## `$mageTriviaErrorFullDONOTUSETHISINCHAT`

#### Description

This is a string with the error message from the [Critical Error](/doc/reference/events.md#critical-error) or [Runtime Error](/doc/reference/events.md#runtime-error) event.

If enabled in [advanced settings](/doc/reference/settings.md#enable-the-magetriviaerrorfull_do_not_use_this_in_chat-variable), it will include more details about the error, including the exact error from the operating system. (If you have not enabled it in the advanced settings, this will be equivalent to [`$mageTriviaError`](#magetriviaerror). This is for your safety.)

:warning: **As the name implies, NEVER use this variable in a message that you are posting to your chat. The error message might include something like a file path, which could include some or all of your name, and therefore "dox" you.**

#### Usage & Examples

```
// Only when handling Critical Error or Runtime Error
$mageTriviaErrorFullDONOTUSETHISINCHAT => String

$mageTriviaErrorFullDONOTUSETHISINCHAT
=> Error reading trivia file: /home/your-real-name-here/trivia.yaml: Error: ENOENT: no such file or directory, open '/home/your-real-name-here/trivia.yaml'
```

#### Notes & Limitations

- This variable is only available for the _Critial Error_ and _Runtime Error_ events. Firebot will not recognize the variable in other contexts.

## `$mageTriviaGameInProgress`

#### Description

This variable returns `true` if there is currently a game in progress and `false` otherwise.

#### Usage & Examples

```
$mageTriviaGameInProgress => boolean

$if[$mageTriviaGameInProgress === true,A game is in progress,No game in progress]
=> A game is in progress
```

This variable is most useful when used in a filter or conditional statement. Perhaps you want to run or skip some effects depending on whether there is an active trivia question.

#### Notes & Limitations

You do _not_ need to worry about avoiding calls to any of the [Mage Trivia built-in effects](/doc/reference/effects.md). For example, if you call the "Cancel Game" effect when there is no question in progress, it will be ignored. And if you call the "Create Game" effect when there is already a question in progress, it will be ignored.

## `$mageTriviaGameResultsRaw`

For advanced use cases. [See source code](/src/variables.ts)

## `$mageTriviaGameTimeRemaining`

### Description

This variable returns the time remaining in the currently active trivia game, in seconds.

If there is not a game in progress, this returns -1.

#### Usage & Examples

```
$mageTriviaGameTimeRemaining => number

$mageTriviaGameTimeRemaining
=> 26.1772394

$mageTriviaGameTimeRemaining
=> -1
```

#### Notes & Limitations

It is possible to use this variable to determine if there is a game in progress, by checking to see if `$mageTriviaGameTimeRemaining` === -1. However, it is preferred to use the [Game In Progress condition](/doc/reference/conditions.md#game-in-progress) or the [`$mageTriviaGameInProgress` variable](#magetriviagameinprogress) instead.

## `$mageTriviaPossibleAnswers`

#### Description

This is an array of the _letters_ for the answers to the question that is in progress, or if there is no in-progress question, the last question that was asked.

Each element of the array contains only the letter, _not_ the answer text.

#### Usage & Examples

```
$mageTriviaPossibleAnswers => Array

$mageTriviaPossibleAnswers
=> ["A", "B", "C", "D"]
```

This is useful in conjunction with `$arrayJoinWith` when chatting the possible answers.

```
Chat $arrayJoinWith[$mageTriviaPossibleAnswers, "or"] to play!
=> Chat A, B, C or D to play!
```

#### Notes & Limitations

This variable is available without restriction, but it is only populated when a question is started. If this variable is used before a question has been asked in this Firebot session, an empty array (`[]`) is returned.

## `$mageTriviaQuestion`

#### Description

This is a string with the question text of the question that is in progress, or if there is no in-progress question, the last question that was asked.

#### Usage & Examples

```
$mageTriviaQuestion => String

$mageTriviaQuestion
=> What is the proper term for a group of kittens?
```

#### Notes & Limitations

This variable is available without restriction, but it is only populated when a question is started. If this variable is used before a question has been asked in this Firebot session, an empty string (`""`) is returned.

## `$mageTriviaQuestionAndAnswersRaw`

For advanced use cases. [See source code](/src/variables.ts)

## `$mageTriviaWinners`

#### Description

This is an array of users who correctly answered the most recently ended question.

Each element of the array contains the display name of the user.

If you want the winners and points earned by each, see [`$mageTriviaWinnersWithPoints`](#magetriviawinnerswithpoints).

#### Usage & Examples

```
$mageTriviaWinners => Array

$mageTriviaWinners
=> ["TheStaticMage", "TheStaticBrock", "Firebot"]
```

#### Notes & Limitations

This variable is available without restriction, but it is only populated when a question has ended. If this variable is called before a question has been asked in this Firebot session or while a question is active, an empty array (`[]`) is returned.

## `$mageTriviaWinnersWithPoints`

#### Description

This is an array of users who correctly answered the most recently ended question, and the points awarded to each.

Each element of the array contains the display name of the user and the points awarded.

If you want just the names of the winners, see [`$mageTriviaWinners`](#magetriviawinners).

#### Usage & Examples

```
$mageTriviaWinnersWithPoints => Array

$mageTriviaWinnersWithPoints
=> ["TheStaticMage (+69)", "TheStaticBrock (+42)", "Firebot (+10)"]
```

This is useful in conjunction with `$arrayJoinWith` when congratulating the winners.

```
Congratulations to ($arrayJoinWith[$mageTriviaWinnersWithPoints, "and"])!
=> Congratulations to TheStaticMage (+69), TheStaticBrock (+42) and Firebot (+10)!
```

You can also detect the case when there were no correct answers to the question by checking for a zero-length array. For example, in the condition of a Conditional Effect:

- Type: Custom
- Value: `$arrayLength[$mageTriviaWinnersWithPoints]`
- Comparator: is
- Expected value: 0

#### Notes & Limitations

This variable is available without restriction, but it is only populated when a question has ended. If this variable is called before a question has been asked in this Firebot session or while a question is active, an empty array (`[]`) is returned.
