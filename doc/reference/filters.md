# Reference: Filters

## Is Trivia Answer

#### Description

This filter is applicable to the Twitch chat message event. It will be true when _all_ of the following are true:

- A trivia game is in progress
- The message contains a single character after leading and trailing spaces are stripped
- The message is one of the valid answer choices (this comparison is case-insensitive, so 'A' and 'a' are the same for example)

#### Use Cases

You can create a dedicated Event to handle only trivia answers:

1. Go to Events &gt; New Event
2. Trigger On: Chat Message (Twitch)
3. Add this filter and select True
