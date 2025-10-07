# Reference: Events

- [Answer Accepted Timer Fired](#answer-accepted-timer-fired)
- [Answer Correct](#answer-correct)
- [Answer Incorrect](#answer-incorrect)
- [Answer Rejected](#answer-rejected)
- [Critical Error](#critical-error)
- [Game Cancelled](#game-cancelled)
- [Game Ended](#game-ended)
- [Game Started](#game-started)
- [Runtime Error](#runtime-error)

## Answer Accepted Timer Fired

#### Description

This event fires periodically while a game is in progress to acknowledge users that have answered the question.

This strategy is used because the Twitch API rate-limits how often messages can be posted by a single account in a channel. If there are a lot of people answering the trivia question and your bot tries to respond individually to each one, it would quickly hit these limits and get timed out. Therefore, the Mage Trivia program "batches" these acknowledgements, allowing you to send one message every few seconds with the names of all the users who have answered.

#### Handling this Event

Most people will handle this event with a Chat effect to post a message such as:

```
Answers accepted for $arrayJoinWith[$mageTriviaAnswerAccepted, "and"]!
=> Answers accepted for Firebot, TheStaticBrock and TheStaticMage!
```

#### Variables

Sets [`$mageTriviaAnswerAccepted`](/doc/reference/variables.md#magetriviaansweraccepted) to an **Array** of users who have answered the question recently the last event (or the start of the game).

Because the event does not fire if nobody has answered the question since the last event, `$mageTriviaAnswerAccepted` is guaranteed to have at least one element.

#### Notes & Limitations

- The event only considers answers that were accepted. If a user's answer was rejected (e.g. not following channel or previously answered the question), that attempted response is not _accepted_ and thus is not considered for the next time this event fires.
- The event only fires if there are answers to acknowledge. If nobody has answered the question since the last event, the event will not fire.
- This event fires only while a game is in progress.
- The frequency of the event can be customized in the [settings](/doc/reference/settings.md#answer-confirmation-interval).
- The event also fires immediately before the game ends (before the [Game Ended](#game-ended) event), assuming of course that there is at least one answer to acknowledge.
- When setting `$mageTriviaAnswerAccepted`, if a user has answered multiple times since the last event, the user is only reported once.
- When setting `$mageTriviaAnswerAccepted`, if the user has been reported in a previous event but then changed their answer since the last event, the user will again be reported in the firing event.
- When setting `$mageTriviaAnswerAccepted`, users are alphabetized.
- When setting `$mageTriviaAnswerAccepted`, the user display name (username with preferred capitalization) is used if available.

## Answer Correct

#### Description

This event fires once for each user who answered the question correctly, once the game has ended.

#### Handling this Event

This event might be used to record user-specific information or statistics. For example:

- Updating lifetime trivia statistics in the user's metadata.
- Updating a counter of total correct trivia answers given in the stream.
- Registering credit for the closing credits role with the [Mage Credits Generator](https://github.com/TheStaticMage/firebot-mage-credits-generator)

#### Variables

Sets [`$mageTriviaAnswerAmount`](/doc/reference/variables.md#) to the amount of currency the player was awarded.

Sets [`$mageTriviaAnswerIndex`](/doc/reference/variables.md#) to the text of the answer that was given by the player (e.g. 0).

Sets [`$mageTriviaAnswerLetter`](/doc/reference/variables.md#) to the letter of the answer that was given by the player (e.g. A, B, C, or D).

Sets [`$mageTriviaAnswerUsername`](/doc/reference/variables.md#) to the username of the player.

#### Notes & Limitations

- This is an advanced event that most users will not handle. The trivia game will work just fine without it.
- The [Game Ended](#game-ended) event is the best place to chat out the correct answer and a summary of the winners. To avoid Twitch rate limits, it is not recommended to chat as part of handling this event.
- This event will always be emitted _after_ the [Game Ended](#game-ended) event.
- This event will not be emitted if the game is cancelled.
- Currency is automatically adjusted by the game. You do not need to handle currency adjustments in this event.
- You can use `$mageTriviaAnswerIndex` in conjunction with [`$mageTriviaAnswers`](/doc/reference/variables.md#magetriviaanswers) to identify the text of the answer that the user provided.
- Other events have already set [`$mageTriviaCorrectAnswers`](/doc/reference/variables.md#magetriviacorrectanswers) which may be useful.

## Answer Incorrect

#### Description

This event fires once for each user who answered the question incorrectly, once the game has ended.

#### Handling this Event

This event might be used to record user-specific information or statistics. For example:

- Updating lifetime trivia statistics in the user's metadata.
- Updating a counter of total incorrect trivia answers given in the stream.

#### Variables

Sets [`$mageTriviaAnswerAmount`](/doc/reference/variables.md#) to the amount of currency the player was penalized. (This will be reported as a positive number, but note that it was _subtracted_ from the user's balance.)

Sets [`$mageTriviaAnswerIndex`](/doc/reference/variables.md#) to the text of the answer that was given by the player (e.g. 0).

Sets [`$mageTriviaAnswerLetter`](/doc/reference/variables.md#) to the letter of the answer that was given by the player (e.g. A, B, C, or D).

Sets [`$mageTriviaAnswerUsername`](/doc/reference/variables.md#) to the username of the player.

#### Notes & Limitations

- This is an advanced event that most users will not handle. The trivia game will work just fine without it.
- The [Game Ended](#game-ended) event is the best place to chat out the correct answer and a summary of the winners. To avoid Twitch rate limits, it is not recommended to chat as part of handling this event.
- This event will always be emitted _after_ the [Game Ended](#game-ended) event.
- This event will not be emitted if the game is cancelled.
- Currency is automatically adjusted by the game. You do not need to handle currency adjustments in this event.
- You can use `$mageTriviaAnswerIndex` in conjunction with [`$mageTriviaAnswers`](/doc/reference/variables.md#magetriviaanswers) to identify the text of the answer that the user provided.
- Other events have already set [`$mageTriviaCorrectAnswers`](/doc/reference/variables.md#magetriviacorrectanswers) which may be useful.

## Answer Rejected

#### Description

This event fires when a user's answer is rejected for one of the following reasons:

- Already answered the question (configurable in [settings](/doc/reference/settings.md#permit-answer-change))
- Insufficient currency balance (configurable in [settings](/doc/reference/settings.md#allow-insufficient-balance))
- Not following channel (configurable in [settings](/doc/reference/settings.md#limit-participation-to-followers))

#### Handling this Event

Most people will handle this event with a Chat effect to post a message such as:

```
Sorry, $userDisplayName[$username], but your answer was not accepted because: $mageTriviaAnswerRejected!
=> Sorry, TheStaticMage, but your answer was not accepted because: You must be following the channel to answer trivia questions!
```

#### Variables

Sets [`$mageTriviaAnswerRejected`](/doc/reference/variables.md#magetriviaanswerrejected) to a **String** with the reason that the answer was rejected.

Sets [`$mageTriviaAnswerRejectedRaw`](/doc/reference/variables.md#magetriviaanswerrejectedraw) to an **Object** intended for advanced use cases.

#### Notes & Limitations

- The event fires only for the predefined conditions described above. This event does not fire for other situations (e.g. user typed something that does not look like a trivia answer, user types something that looks like a trivia answer that was received while a game is not in progress).

## Critical Error

#### Description

This event fires when the program encounters a critical error that may prevent the trivia program from working correctly in a user-affecting way. Critical errors generally need immediate attention.

Critical error events are fired in these situations:

- API error interacting with Open Trivia Database
- Question could not be obtained when attempting to create a trivia game
- Question source not properly configured (see [settings](/doc/reference/settings.md#trivia-source))
- [Question file](/doc/questions.md) is not configured but the File source is selected
- [Question file](/doc/questions.md) could not be read or parsed
- Used question cache could not be saved properly (see [settings](/doc/reference/settings.md#persist-used-questions-between-sessions))

#### Handling this Event

You should handle this event in a way that will get the your attention, for example:

- If you use the Firebot dashboard, use a Chat Feed Alert or Activity Feed Alert
    - Example: `$mageTriviaError: $mageTriviaErrorFull`
- Play a sound that only you can hear
- As a last resort, you could post to your chat
    - It is safe to post `$mageTriviaError` in chat.
    - :warning: NEVER post `$mageTriviaErrorFull` in chat because it could contain sensitive information.

#### Variables

Sets [`$mageTriviaError`](/doc/reference/variables.md#magetriviaerror) to a string with a basic error message.

Sets [`$mageTriviaErrorFull`](/doc/reference/variables.md#magetriviaerrorfull) to a string with a more detailed error message.

- This detailed error message sometimes contains the full error from the operating system, which can be very handy for debugging, but which can sometimes contain sensitive information. You should never use this variable in any message posted to your chat.

## Game Cancelled

#### Description

This event fires when a trivia game is successfully cancelled (in response to the [Cancel Game](/doc/reference/effects.md#cancel-game) effect).

#### Handling this Event

You might want to post a message in chat, such as `The trivia game has been cancelled.` Or you might not want to do anything. (Cancelling an in-progress game will be rare and only occurs as a direct result of your request to do so, and as such you are probably talking about it on your stream.)

Notes:

- You do _not_ need to make any currency adjustments in response to this event. The program will undo any currency adjustments that were perform in a cancelled game.

#### Variables

Causes [`$mageTriviaGameInProgress`](/doc/reference/variables.md#magetriviagameinprogress) to be `false`.

Empties [`$mageTriviaGameResultsRaw`](/doc/reference/variables.md#magetriviagameresultsraw).

Empties [`$mageTriviaWinners`](/doc/reference/variables.md#magetriviawinners).

Empties [`$mageTriviaWinnersWithPoints`](/doc/reference/variables.md#magetriviawinnerswithpoints).

Note: Variables associated with the question ([`$mageTriviaAnswers`](/doc/reference/variables.md#magetriviaanswers), [`$mageTriviaCorrectAnswers`](/doc/reference/variables.md#magetriviacorrectanswers), [`$mageTriviaPossibleAnswers`](/doc/reference/variables.md#magetriviapossibleanswers), [`$mageTriviaQuestion`](/doc/reference/variables.md#magetriviaquestion), [`$mageTriviaQuestionAndAnswersRaw`](/doc/reference/variables.md#magetriviaquestionandanswersraw)) will remain available even when the game is cancelled.

## Game Ended

#### Description

This event fires when a trivia game has ended normally.

Note: This event does _not_ fire when a game is cancelled (the [Game Cancelled](#game-cancelled) event fires in that case) or if a game fails to start correctly (the [Critical Error](#critical-error) event fires in that case).

#### Implementation

You will generally want to share the correct answer and congratulate winners (if any).

You can start out with a Chat effect that posts a message like the following:

```
Trivia game ended. Correct answer: $arrayJoinWith[$mageTriviaCorrectAnswers]. $if[$arrayLength[$mageTriviaWinnersWithPoints] == 0, Nobody answered the question correctly, Congratulations to $arrayJoinWith[$mageTriviaWinnersWithPoints,and] for answering correctly]!
```

There is definitely room for creativity here. For example:

- Conditional effects based on the number of winners
- Providing a Twitch shout-out to the first winner

Notes:

- You do _not_ need to make currency adjustments, such as awarding currency to winners or penalizing incorrect answers. The program handles all currency adjustments.

#### Variables

Causes [`$mageTriviaGameInProgress`](/doc/reference/variables.md#magetriviagameinprogress) to be `false`.

Populates [`$mageTriviaGameResultsRaw`](/doc/reference/variables.md#magetriviagameresultsraw).

Sets [`$mageTriviaWinners`](/doc/reference/variables.md#magetriviawinners) to an array of users who answered the question correctly.

Sets [`$mageTriviaWinnersWithPoints`](/doc/reference/variables.md#magetriviawinnerswithpoints) to an array of users who answered the question correctly and the number of points each earned for doing so.

Note: Variables associated with the question ([`$mageTriviaAnswers`](/doc/reference/variables.md#magetriviaanswers), [`$mageTriviaCorrectAnswers`](/doc/reference/variables.md#magetriviacorrectanswers), [`$mageTriviaPossibleAnswers`](/doc/reference/variables.md#magetriviapossibleanswers), [`$mageTriviaQuestion`](/doc/reference/variables.md#magetriviaquestion), [`$mageTriviaQuestionAndAnswersRaw`](/doc/reference/variables.md#magetriviaquestionandanswersraw)) will remain available even when the game ends.

## Game Started

#### Description

This event fires when a game has been created (in response to the [Create Game](/doc/reference/effects.md#create-game) effect).

Note: This event does _not_ fire if there was an error creating the game. In that case, a [Critical Error](#critical-error) event is fired instead.

#### Implementation

You will generally want to provide the question text and the answer choices to the players, possibly along with instructions to play.

You can start out with a Chat effect that posts a message like the following:

```
Try this trivia question! $mageTriviaQuestion $arrayJoin[$mageTriviaAnswers, " "] | Chat your answer ($arrayJoinWith[$mageTriviaPossibleAnswers, or]) within 30 seconds to play!
```

There is definitely room for creativity. For example, I use a browser source to [display the trivia question and answers on my stream](/doc/cookbook/display-question-on-screen.md) in addition to chat.

#### Variables

Sets [`$mageTriviaAnswers`](/doc/reference/variables.md#magetriviaanswers) to an array of each multiple-choice answer with its letter.

Sets [`$mageTriviaCorrectAnswers`](/doc/reference/variables.md#magetriviacorrectanswers) to an array of each _correct_ multiple-choice answer with its letter.

Causes [`$mageTriviaGameInProgress`](/doc/reference/variables.md#magetriviagameinprogress) to be `true` until the game ends or is cancelled.

Empties [`$mageTriviaGameResultsRaw`](/doc/reference/variables.md#magetriviagameresultsraw).

Sets [`$mageTriviaPossibleAnswers`](/doc/reference/variables.md#magetriviapossibleanswers) to an array of the letters that might be answers.

Sets [`$mageTriviaQuestion`](/doc/reference/variables.md#magetriviaquestion) to the text of the question.

Populates [`$mageTriviaQuestionAndAnswersRaw`](/doc/reference/variables.md#magetriviaquestionandanswersraw).

Empties [`$mageTriviaWinners`](/doc/reference/variables.md#magetriviawinners).

Empties [`$mageTriviaWinnersWithPoints`](/doc/reference/variables.md#magetriviawinnerswithpoints).

## Runtime Error

#### Description

This event fires when the program encounters a non-critical runtime error. These generally indicate some kind of configuration error that should be fixed at some point, but not necessarily immediately.

Runtime error events are fired in these situations:

- A question in the [YAML question file](/doc/questions.md) has no correct answers. (This question will not be asked.)
- Called the "Cancel Game" effect when there was no trivia question in progress. (The call will be ignored.)
- Called the "Create Game" effect when there was already a trivia question in progress. (The call will be ignored.)

#### Handling this Event

You should handle this event in a way that will get the your attention, for example:

- If you use the Firebot dashboard, use a Chat Feed Alert or Activity Feed Alert
    - Example: `$mageTriviaError: $mageTriviaErrorFullDONOTUSETHISINCHAT`
- Play a sound that only you can hear
- As a last resort, you could post to your chat
    - It is safe to post `$mageTriviaError` in chat.
    - :warning: NEVER post `$mageTriviaErrorFullDONOTUSETHISINCHAT` in chat because it could contain sensitive information.

#### Variables

Sets [`$mageTriviaError`](/doc/reference/variables.md#magetriviaerror) to a string with a basic error message.

Sets [`$mageTriviaErrorFullDONOTUSETHISINCHAT`](/doc/reference/variables.md#magetriviaerrorfull_do_not_use_this_in_chat) to a string with a more detailed error message.

- This detailed error message sometimes contains the full error from the operating system, which can be very handy for debugging, but which can contain sensitive information.

- This detailed error message must be enabled in [settings](/doc/reference/settings.md#enable-the-magetriviaerrorfull_do_not_use_this_in_chat-variable) (to make absolutely sure you are aware of what it contains).
