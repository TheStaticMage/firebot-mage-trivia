# Reference: Effects

## Cancel Trivia Question

#### Description

This effect cancels the in-progress trivia question (if any). It refunds any currency that may have been deducted from people who answered the question.

When the question is successfully canceled, the [Question Cancelled](/doc/reference/events.md#question-cancelled) event will fire.

If this effect is called while there is not a question in progress, it will be ignored.

#### Recommended Usage

- Map to a command that's limited to the streamer
- Map to a quick action
- Add to a preset effect list, and then map a StreamDeck button to that preset effect list

## Create Trivia Question

#### Description

This effect causes a new trivia question to be selected and for the game timer (which is built in to Mage Trivia) to be started.

When a question has been started successfully, the [Question Started](/doc/reference/events.md#question-started) event will fire.

IMPORTANT: You should handle all user interaction, e.g. chatting the question, in the event handler for Question Started -- _NOT_ in the same effect list that sends the _Create Trivia Question_ effect. In addition, you do _not_ need to take any action, such as in an event handler, effect list, or Firebot timer, to end the trivia question. The [Question Ended](/doc/reference/events.md#question-ended) will fire automatically when the game ends.

If this effect is called while there is already a question in progress, it will be ignored.

#### Recommended Usage

- Run from a Firebot timer to ask a trivia question periodically
- Trigger from the Ad Break Started event to run a trivia question during ad breaks
- Map to a command that's limited to the streamer
- Map to a quick action
- Add to a preset effect list, and then map a StreamDeck button to that preset effect list

## Process Trivia Answer

#### Description

This effect feeds a user's trivia answer into the game program.

If this effect is called while there is not a question in progress, it will be ignored.

#### Recommended Usage

There's really only one way that makes sense: adding an event handler for the Chat Message event and feeding the settings from that event into this effect.

The following screen capture shows the recommended setup:

![Chat Message effect](/doc/img/reference/effects/chat-message-trivia-event.png)
