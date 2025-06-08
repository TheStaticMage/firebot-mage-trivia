# Reference: Effects

- [Cancel Game](#cancel-game)
- [Create Game](#create-game)
- [Process Trivia Answer](#process-trivia-answer)

## Cancel Game

#### Description

This effect cancels the in-progress game (if any). It refunds any currency that may have been deducted from people who answered the question while the game was in progress.

When the game is successfully canceled, the [Game Cancelled](/doc/reference/events.md#game-cancelled) event will fire.

If this effect is called while there is not a game in progress, it will be ignored.

#### Recommended Usage

- Map to a command that's limited to the streamer
- Map to a quick action
- Add to a preset effect list, and then map a StreamDeck button to that preset effect list

## Create Game

#### Description

This effect causes a new trivia question to be selected and for the game timer (which is built in to Mage Trivia) to be started.

When a game has been started successfully, the [Game Started](/doc/reference/events.md#game-started) event will fire.

IMPORTANT: You should handle all user interaction, e.g. chatting the question, in the event handler for Game Started -- _NOT_ in the effect list that sends the _Create Game_ effect. In addition, you do _not_ need to take any action, such as in an event handler, effect list, or Firebot timer, to end the game. The [Game Ended](/doc/reference/events.md#game-ended) will fire automatically when the game ends.

If this effect is called while there is already a game in progress, it will be ignored.

#### Recommended Usage

- Run from a Firebot timer to ask a trivia question periodically
- Trigger from the Ad Break Started event to run trivia during ad breaks
- Map to a command that's limited to the streamer
- Map to a quick action
- Add to a preset effect list, and then map a StreamDeck button to that preset effect list

## Process Trivia Answer

#### Description

This effect feeds a user's trivia answer into the game program.

This effect will only take action if all of the following are true:

- A trivia game is in progress
- The message contains a single character after leading and trailing spaces are stripped
- The message is one of the valid answer choices (this comparison is case-insensitive, so 'A' and 'a' are the same for example)

It is safe to call this event on every chat message. The handler will silently disregard any messages not matching the pattern and any messages received while there is no game in progress.

#### Recommended Usage

We recommend adding this effect to an event handler for the "Chat Message" event.

The following screen capture shows the recommended setup:

![Chat Message effect](/doc/img/reference/effects/chat-message-trivia-event.png)

You can explore the [Is Trivia Answer](/doc/reference/filters.md#is-trivia-answer) filter for further refinement.
