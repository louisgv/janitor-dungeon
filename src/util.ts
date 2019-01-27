import TwitchClient, { AccessToken } from "twitch";

import {
  clientId,
  clientSecret,
  clientRefreshToken,
  clientAccessToken
} from "./secret.json";

const KEY = {
  REFRESH_TOKEN_CACHE: "REFRESH_TOKEN_CACHE",
  ACCESS_TOKEN_CACHE: "ACCESS_TOKEN_CACHE"
};

export function getTwitchClient() {
  const refreshToken =
    localStorage.getItem(KEY.REFRESH_TOKEN_CACHE) || clientRefreshToken;
  const accessToken =
    localStorage.getItem(KEY.ACCESS_TOKEN_CACHE) || clientAccessToken;

  return TwitchClient.withCredentials(clientId, accessToken, {
    clientSecret,
    refreshToken,
    onRefresh: (token: AccessToken) => {
      localStorage.setItem(KEY.REFRESH_TOKEN_CACHE, token.refreshToken);
      localStorage.setItem(KEY.ACCESS_TOKEN_CACHE, token.accessToken);
    }
  });
}

export async function isStreamLive(
  userName: string,
  twitchClient: TwitchClient
) {
  const user = await twitchClient.users.getUserByName(userName);
  if (!user) {
    return false;
  }

  return (await user.getStream()) !== null;
}
