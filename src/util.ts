import TwitchClient from "twitch";

export async function isStreamLive(userName: string, twitchClient: TwitchClient) {
	const user = await twitchClient.users.getUserByName(userName);
	if (!user) {
		return false;
	}
	
	return await user.getStream() !== null;
}