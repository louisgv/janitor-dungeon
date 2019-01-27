const electron = require("electron");

const TwitchClient = require("twitch").default;

const fs = require("fs-extra");

const ChatClient = require("twitch-chat-client").default;

const SECRET_PATH="./secret.json";

const DATA_PATH="./data.json";

const SAVE_TIMER=10000;

const SHAPES = ['TRIANGLE', 'CIRCLE', 'SPECIAL']

const SHAPE_ENUM = {
  TRIANGLE: 0,
  CIRCLE: 1,
  SPECIAL: 2
}

const DATA_MODEL = {
  init: true,
  monster: {
    level: 1,
    currentHealth: 0,
    maxHealth: 0,
    shape: SHAPE_ENUM.TRIANGLE
  }
}

// NEED TO DEBUG THIS ONE:
function getMonsterHealth({lastHealth, followers, views, level}) {
  return (followers + views + level * 9) + lastHealth * Math.E;
}

async function initializeChatClient(mainWindow) {
  const {secret, twitchClient} = await getTwitchClient();
  const username = secret.clientUsername;

  let stream = await getStream(username, twitchClient);

  if (!stream) {
    electron.dialog.showErrorBox("STREAM OFFLINE!", "Please try again when stream is online...");
    electron.app.quit(); 
    return;
  }

  mainWindow.webContents.send("connected");

  console.log("STREAM ONLINE -----------------------------");
  let channelData = stream.channel.followers
    ? stream.channel
    : stream.channel._data;

  const [gameData, chatClient] = await Promise.all([
    getGameData(channelData),
    ChatClient.forTwitchClient(twitchClient)
  ])

  mainWindow.webContents.send("app", "newGame");
  await chatClient.connect();

  mainWindow.webContents.send("newMonster", gameData.monster);
  await chatClient.waitForRegistration();
  
  mainWindow.webContents.send("monsterHealthUpdate", {
    current: gameData.monster.currentHealth,
    max: gameData.monster.maxHealth
  });

  await chatClient.join(username);

  // Single point of writing to file
  const autosaveInterval = setInterval(async ()=> {
    console.log("DATA AUTOSAVED -----------------------------");

    if(!gameData.monster.currentHealth || gameData.monster.currentHealth <= 0) {

      mainWindow.webContents.send("app", "newGame");

      stream = await getStream(username, twitchClient);
  
      if(!stream) {
        // ABORT STREAM
        electron.dialog.showErrorBox("STREAM ABORTED, DATA CORRUPTED! -----------------------------");
        electron.app.quit(); 
        return;
      }
  
      channelData = stream.channel.followers
        ? stream.channel
        : stream.channel._data;

      console.log(channelData);
      console.log(channelData.followers);
      console.log(channelData.views);

      const level = gameData.monster.level + 1;
      const newHealth = getMonsterHealth({
        level,
        lastHealth: gameData.monster.maxHealth,
        followers: channelData.followers,
        views: channelData.views
      });

      console.log(newHealth)

      gameData.monster.level = level;
      gameData.monster.currentHealth = newHealth;
      gameData.monster.maxHealth = newHealth;
      gameData.monster.shape = getMonsterShape(level);

      mainWindow.webContents.send("newMonster", gameData.monster);

      mainWindow.webContents.send("monsterHealthUpdate", {
        current: gameData.monster.currentHealth,
        max: gameData.monster.maxHealth
      });
    }
    
    await fs.writeJSON(DATA_PATH, gameData, {spaces: '\t'});
  }, SAVE_TIMER);

  const messageListener = await chatClient.onPrivmsg(
    (channel, user, message, msg) => {
      console.log("STREAM MESSAGE -----------------------------");
      console.log(user);
      console.log(message);
      console.log(gameData.monster);

      // Prevent concurrent write when invalid
      if(gameData.monster.currentHealth <= 0) {
        return;
      }

      switch (message) {
        case '!raid':
          // chatClient.say(channel, `@${user} is initiate a raid ! ! !`);    
          break;
        case '!monsterInfo':
          const {level, shape} = gameData.monster;
          const shapeString = SHAPES[shape];
          chatClient.say(channel, `It is a Level ${level} ${shapeString} ! ! !`);    
          break;
      
        default:{
          mainWindow.webContents.send("message", { user, message });
          
          const damageAmount = getDamageAmount(message);
          
          gameData.monster.currentHealth -= damageAmount;

          mainWindow.webContents.send("damageDealt", {
            damageAmount
          });

          mainWindow.webContents.send("monsterHealthUpdate", {
            current: gameData.monster.currentHealth,
            max: gameData.monster.maxHealth
          });
          
          if(gameData.monster.currentHealth <= 0) {
            mainWindow.webContents.send("app", "gameOver");
          }    
        }
      }
    }
  );

  mainWindow.on("closed", ()=>{
    console.log("CLOSING -------------------");
    clearInterval(autosaveInterval);
    chatClient.removeListener(messageListener);
  });
}

function getMonsterShape(level) {
  if (level % 3 === 0) return 2;
  else return Math.round(Math.random());
}

function getDamageAmount(message) {
  return message.replace(/\s/g, "").length * 10;
}

async function getGameData({followers, views}) {
  try {
    let data = await fs.readJSON(DATA_PATH);
    
    if(!data.init) {
      data = JSON.parse(JSON.stringify(DATA_MODEL));

      console.log(followers, views);
      
      const initHealth = getMonsterHealth({
        level: 1,
        lastHealth: 0,
        followers,
        views
      });

      data.monster.currentHealth = initHealth;
      data.monster.maxHealth = initHealth;
      data.monster.shape = getMonsterShape(1);

      await fs.writeJSON(DATA_PATH, data, {spaces: '\t'});
    }

    return data;

  } catch (error) {
    electron.dialog.showErrorBox("DATA FILE INVALID!", error.message);
    electron.app.quit(); 
  }
}

async function getTwitchClient() {
  try {
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
  } catch (error) {
      electron.dialog.showErrorBox("SECRET FILE INVALID!", error.message);
      electron.app.quit(); 
  }
}


async function getStream(userName, twitchClient) {
  const user = await twitchClient.users.getUserByName(userName);
  if (!user) {
    return false;
  }

  return user.getStream();
}

module.exports = {
  initializeChatClient,
  getTwitchClient,
  isStreamLive: getStream
};
