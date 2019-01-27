const TwitchClient = require("twitch").default;

const fs = require("fs-extra");

const ChatClient = require("twitch-chat-client").default;

const SECRET_PATH="./secret.json";

async function initializeChatClient(mainWindow) {
  const {secret, twitchClient} = await getTwitchClient();
  const username = secret.clientUsername;

  const isStreamOnline = await isStreamLive(username, twitchClient);

  if (!isStreamOnline) {
    return;
  }

  mainWindow.webContents.send("connected");

  console.log("STREAM ONLINE -----------------------------");

  const chatClient = await ChatClient.forTwitchClient(twitchClient);

  await chatClient.connect();
  await chatClient.waitForRegistration();
  await chatClient.join(username);

  const messageListener = await chatClient.onPrivmsg(
    (channel, user, message, msg) => {
      console.log("STREAM MESSAGE -----------------------------");
      console.log(user);
      console.log(message);

      mainWindow.webContents.send("message", { user, message });
    }
  );
}

async function getTwitchClient() {
  const secret = await fs.readJSON(SECRET_PATH);

  // console.log(JSON.stringify(file));

  const {
    clientId,
    clientSecret,
    clientRefreshToken,
    clientAccessToken
  } = secret;

  const refreshToken = clientRefreshToken;
  const accessToken = clientAccessToken;

  const twitchClient = TwitchClient.withCredentials(clientId, accessToken, {
    clientSecret,
    refreshToken,
    onRefresh: token => {
      secret.clientAccessToken = token.accessToken;
      secret.clientRefreshToken = token.refreshToken;

      fs.writeJson(SECRET_PATH, secret);

      console.log("CREDENETIAL REFRESHED ---------------------------");
    }
  });

  return {
    secret,
    twitchClient
  }
}


async function isStreamLive(userName, twitchClient) {
  const user = await twitchClient.users.getUserByName(userName);
  if (!user) {
    return false;
  }

  return (await user.getStream()) !== null;
}

module.exports = {
  initializeChatClient,
  getTwitchClient,
  isStreamLive
};
