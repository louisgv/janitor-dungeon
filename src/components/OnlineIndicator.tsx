import React, { useState, useEffect } from "react";

import electron from 'electron';

export default ({username, twitchClient} : any) => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    electron.ipcRenderer.on('connected', ()=>{
      setIsOnline(true);
    })
  });
  
  return <div>Stream status: {isOnline ? "ONLINE ✨" : "OFFLINE 💩"}</div>;
};
