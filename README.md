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

1. From the latest [Release](https://github.com/TheStaticMage/firebot-mage-trivia/releases), download `Firebot-MageTrivia-<version>.js` into your Firebot scripts directory (File &gt; Open Data Folder, then select the "scripts" directory).

    :warning: If you are upgrading from a prior version, delete any older versions of this script.

2. Enable custom scripts in Firebot (Settings &gt; Scripts).

3. Add the `Firebot-MageTrivia-<version>.js` script that you just added as a startup script (Settings &gt; Scripts &gt; Manage Startup Scripts &gt; Add New Script).

    :warning: If you are upgrading from a prior version, delete any references to the older versions.

4. Restart Firebot.

## Quick Start

1. If you do not have a [Currency](https://youtu.be/X60p7rSF98w?si=v4oxmFLGxVxlmHWz&t=58) configured in Firebot, set one up now (Currency &gt; Add Currency). You can use Mage Trivia with an existing currency or you may create a currency just for Mage Trivia -- your choice.

2. Configure the settings (Firebot &gt; Games &gt; Mage Trivia).

    - Check the "Enabled" box.
    - Expand "Currency Settings" and select the desired currency for the game.
    - Check the "Allow Insufficient Balance" box.
        _This is just for now: if you created a new currency, you won't have any yet, and we want the quick start to work. You can leave this unchecked if you are using an existing currency._
    - Click the Save button.

    _There are a number of other [settings](/doc/settings.md) that you may explore either now or later._

3. For your convenience, I have created an importable "setup" with some Firebot resources (events, preset effect lists, etc.) to have a minimally functional trivia game.

    - Download the `MageTriviaResources-<version>.firebotsetup` file from the [Release](https://github.com/TheStaticMage/firebot-mage-trivia/releases)
    - Import this setup (File &gt; Import Firebot Setup...)

4. Try it out.

    - Make sure your Firebot instance is connected to Twitch.
    - Navigate to Preset Effect Lists.
    - Click the icon next to "Mage Trivia: Ask Question Now!".
    - Head to your Twitch chat to play.

5. Next steps:

    - Consider triggering the "ask question now" preset effect list via a command, quick action, or timer.
    - Customize the chat messages for the various Mage Trivia events to suit your style.
    - Explore the [settings](/doc/reference/settings.md) to tweak the behavior as you prefer.
    - Browse the [cookbook](/doc/cookbook/) for some ideas for further integration and customization.
    - Curate your own trivia questions according to the [Question Curation Guide](/doc/questions.md).

## Documentation

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

The best way to get help is in this project's thread on Discord. Join the [Crowbar Tools Discord](https://discord.gg/crowbartools-372817064034959370) and then visit the [thread for Mage Trivia]() there.

  - Please do not DM me on Discord.
  - Please do not ask for help in my chat when I am live on Twitch.

Bug reports and feature requests are welcome via [GitHub Issues](https://github.com/TheStaticMage/firebot-mage-trivia/issues).

## Contributing

Contributions are welcome via [Pull Requests](https://github.com/TheStaticMage/firebot-mage-trivia/pulls). I _strongly suggest_ that you contact me before making significant changes, because I'd feel really bad if you spent a lot of time working on something that is not consistent with my vision for the project. Please refer to the [Mage Trivia Contribution Guidelines](/.github/contributing.md) for specifics.

## License

Mage Trivia is released under the [GNU General Public License version 3](/LICENSE). That makes it free to use whether your stream is monetized or not.

If you use this on your stream, I would appreciate a shout-out. (Appreciated, but not required.)

- <https://www.twitch.tv/thestaticmage>

A small amount of code was copied from [Firebot](https://github.com/crowbartools/firebot), which you're presumably already using, and which has the same license.

## FAQ

### Can I tie this into Twitch channel points instead of Firebot currency?

No. Twitch doesn't allow adding or removing of channel points via the API.

### Why is this called Mage Trivia?

This game is consistently called "Mage Trivia" to distinguish it from the trivia game that is built in to Firebot. It's named after my Twitch username. Note that you don't (necessarily) have to have your trivia questions pertain to mages, although that _would_ be pretty cool.
