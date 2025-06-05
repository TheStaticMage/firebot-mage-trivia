import { logger } from '../firebot';
import { triviaGame } from '../globals';

export class TwitchUtil {
    public static async isUserFollowing(username: string): Promise<boolean> {
        const firebotManager = triviaGame.getFirebotManager();
        const streamerUsername = firebotManager.getStreamerUsername();
        if (username === streamerUsername) {
            // You can't follow yourself, but you probably don't want this to return false.
            logger('debug', `isUserFollowing: User ${username} is the streamer.`);
            return true;
        }

        const userDb = firebotManager.getUserDb();
        const user = await userDb.getTwitchUserByUsername(username);
        if (!user) {
            logger('debug', `isUserFollowing: User ${username} does not exist.`);
            return false;
        }

        const twitchApi = firebotManager.getTwitchApi();
        const followDate = await twitchApi.users.getFollowDateForUser(username);
        if (followDate) {
            logger('debug', `isUserFollowing: User ${username} is following since ${followDate}.`);
            return true;
        }

        logger('debug', `isUserFollowing: User ${username} is not following.`);
        return false;
    }
}
