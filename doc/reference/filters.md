# Reference: Filters

## Is Trivia Answer

### Description

This filter is applicable to the Twitch chat message event. It will be true when _all_ of the following are true:

- A trivia game is in progress
- The message contains a single character after leading and trailing spaces are stripped
- The message is one of the valid answer choices (this comparison is case-insensitive, so 'A' and 'a' are the same for example)

### Use Cases

You can create a dedicated Event to handle only trivia answers:

1. Go to Events &gt; New Event
2. Trigger On: Chat Message (Twitch)
3. Add this filter and select True

## Platform

This filter is applicable when you are using the [Firebot Mage Kick Integration](https://github.com/TheStaticMage/firebot-mage-kick-integration). It will help you ensure that any messages for the following events are sent to the correct platform:

- Answer Correct
- Answer Incorrect
- Answer Rejected

It is recommended that you create a separate event per platform (using this filter to distinguish them). As you create effects for each event, be sure that you use the appropriate chat effect to route any chat messages to the desired platform.
