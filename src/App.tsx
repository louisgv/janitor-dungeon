import React, { useState, useEffect } from 'react';

import TwitchClient, { AccessToken } from 'twitch';

import {clientId, clientSecret, clientRefreshToken, clientAccessToken} from './secret.json';
import { isStreamLive } from './util';

const KEY = {
  REFRESH_TOKEN_CACHE: "REFRESH_TOKEN_CACHE",
  ACCESS_TOKEN_CACHE: "ACCESS_TOKEN_CACHE"
}

const refreshToken = localStorage.getItem(KEY.REFRESH_TOKEN_CACHE) || clientRefreshToken;
const accessToken = localStorage.getItem(KEY.ACCESS_TOKEN_CACHE) || clientAccessToken;

const twitchInstance = TwitchClient.withCredentials(clientId, accessToken, {
  clientSecret, 
  refreshToken,
  onRefresh: (token: AccessToken) => {
    localStorage.setItem(KEY.REFRESH_TOKEN_CACHE, token.refreshToken);
    localStorage.setItem(KEY.ACCESS_TOKEN_CACHE, token.accessToken);
  }
});

const App =()=> {

  const [isOnline, setIsOnline] = useState(true);

  const getIsOnline = async() => {
    setIsOnline(await isStreamLive('louisgv', twitchInstance));
  };

  useEffect(()=>{
    getIsOnline()
  });

  return (
    <div>
      Stream online: {isOnline ? "TRU" : "FAL"}
    </div>
  );
}

export default App;
