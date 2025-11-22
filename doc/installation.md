# Installation

## Version Compatibility

| Plugin Version | Minimum Firebot Version |
| --- | --- |
| 0.1.0+ | 5.65 |
| 0.0.4 | 5.64 |

## Installation: Plugin

1. Enable custom scripts in Firebot (Settings > Scripts) if you have not already done so.
2. From the latest [Release](https://github.com/TheStaticMage/firebot-mage-trivia/releases), download `Firebot-MageTrivia-<version>.js` into your Firebot scripts directory (File > Open Data Folder, then select the "scripts" directory).
3. Go to Settings > Scripts > Manage Startup Scripts > Add New Script and add the `Firebot-MageTrivia-<version>.js` plugin.
4. Restart Firebot. (The plugin will _not_ be loaded until you actually restart Firebot.)

## Configuration

1. If you do not have a [Currency](https://youtu.be/X60p7rSF98w?si=v4oxmFLGxVxlmHWz&t=58) configured in Firebot, set one up now (Currency > Add Currency). You can use Mage Trivia with an existing currency or you may create a currency just for Mage Trivia—your choice.

2. Configure the settings (Firebot > Games > Mage Trivia).
   - Check the "Enabled" box.
   - Expand "Currency Settings" and select the desired currency for the game.
   - Check the "Allow Insufficient Balance" box. (This is just for initial setup: if you created a new currency, you won't have any yet, and we want the quick start to work. You can leave this unchecked if you are using an existing currency.)
   - Click the Save button.

   For additional settings, see [Settings](/doc/reference/settings.md).

3. For your convenience, there is an importable "setup" with some Firebot resources (events, preset effect lists, etc.) to have a minimally functional trivia game.
   - Download the [`MageTriviaResources.firebotsetup`](/misc/setup/MageTriviaResources.firebotsetup)
   - Import this setup (File > Import Firebot Setup...)

## Testing

1. Make sure your Firebot instance is connected to Twitch.
2. Navigate to Preset Effect Lists.
3. Click the icon next to "Mage Trivia: Ask Question Now!".
4. Head to your Twitch chat to play.

## Next Steps

- Consider triggering the "ask question now" preset effect list via a command, quick action, or timer.
- Customize the chat messages for the various Mage Trivia events to suit your style.
- Explore the [settings](/doc/reference/settings.md) to tweak the behavior as you prefer.
- Browse the [cookbook](/doc/cookbook/) for integration and customization ideas.
- Curate your own trivia questions according to the [Question Curation Guide](/doc/questions.md).
