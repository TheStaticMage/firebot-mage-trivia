# Firebot "Mage Trivia" Game

## Introduction

This is a multi-player chat trivia game for [Firebot](https://firebot.app/) (the all-in-one bot for Twitch streamers).

Features:

- Supports two sources of questions:
  - A local file with questions that you curate
  - Open Trivia Database <https://opentdb.com/>

- Easy to play:
  - No `!commands` needed: just type A, B, C, D to answer
  - Everyone in your chat can answer the question

- Flexible scoring:
  - Use the Firebot currency of your choice
  - Configure penalty for incorrect answers, or set to 0 to encourage guessing
  - Configure a time bonus for faster correct answers

Note that there is already a built-in trivia game that's part of Firebot. The built-in game allows users to request a question with a `!trivia <wager>` command, getting a question that only they answer. When I tried this on my stream, my chat never quite caught on to the fact that only the person who had requested the question could answer it. Everybody wanted to play along! In addition, I wanted to theme my trivia by curating my own questions. I wrote Mage Trivia to address these needs.

Feel free to stop by my Twitch stream (<https://www.twitch.tv/thestaticmage>) where you will find Mage Trivia powering "cat trivia" during ad breaks and every 15 minutes during the stream.

## Installation

See [Installation](/doc/installation.md) for setup instructions and version compatibility information.

## Documentation

- [Installation](/doc/installation.md): Setup instructions and version compatibility
- [Upgrading](/doc/upgrading.md): Upgrade procedure and version compatibility
- [Question Curation Guide](/doc/questions.md): Curate your own set of questions and answers
- Cookbook
  - [Displaying Questions On Screen](/doc/cookbook/display-question-on-screen.md)
  - [Heads-Up Before Questions](/doc/cookbook/heads-up-before-questions.md)
  - [Restrict Answering to Followers](/doc/cookbook/restrict-answer-to-followers.md)
- Reference
  - [Conditions](/doc/reference/conditions.md)
  - [Effects](/doc/reference/effects.md)
  - [Events](/doc/reference/events.md)
  - [Filters](/doc/reference/filters.md)
  - [Settings](/doc/reference/settings.md)
  - [Variables](/doc/reference/variables.md)

## Support

The best way to get help is in my Discord server. Join the [The Static Discord](https://discord.gg/TmvGn3ywws) and then visit the `#firebot-mage-trivia` channel there.

- Please do not DM me on Discord.
- Please do not ask for help in my chat when I am streaming.

Bug reports and feature requests are welcome via [GitHub Issues](https://github.com/TheStaticMage/firebot-mage-trivia/issues).

## Contributing

Contributions are welcome via [Pull Requests](https://github.com/TheStaticMage/firebot-mage-trivia/pulls). I _strongly suggest_ that you contact me before making significant changes, because I'd feel really bad if you spent a lot of time working on something that is not consistent with my vision for the project. Please refer to the [Mage Trivia Contribution Guidelines](/.github/contributing.md) for specifics.

## License

Mage Trivia is released under the [GNU General Public License version 3](/LICENSE). That makes it free to use whether your stream is monetized or not.

If you use this on your stream, I would appreciate a shout-out. (Appreciated, but not required.)

- <https://www.twitch.tv/thestaticmage>
- <https://kick.com/thestaticmage>
- <https://youtube.com/@thestaticmagerisk>

A small amount of code was copied from [Firebot](https://github.com/crowbartools/firebot), which you're presumably already using, and which has the same license.

## FAQ

### Can I tie this into Twitch channel points instead of Firebot currency?

No. Twitch doesn't allow adding or removing of channel points via the API.

### Why is this called Mage Trivia?

This game is consistently called "Mage Trivia" to distinguish it from the trivia game that is built in to Firebot. It's named after my Twitch username. Note that you don't (necessarily) have to have your trivia questions pertain to mages, although that _would_ be pretty cool.
