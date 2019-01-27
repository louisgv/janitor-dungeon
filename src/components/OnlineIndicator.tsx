import React, { useState, useEffect, useRef } from "react";

import electron from 'electron';

export default ({username, twitchClient} : any) => {
  const [isOnline, setIsOnline] = useState(false);
  
  const setIsOnlineRef = useRef(()=>{
    setIsOnline(true);
  });


  useEffect(() => {
    electron.ipcRenderer.on('connected', setIsOnlineRef.current);
  
    return () => {
      // Clean up the subscription
      electron.ipcRenderer.removeListener("connected", setIsOnlineRef.current)
    };
  });

  return <div>Stream status: {isOnline ? "ONLINE ✨" : "OFFLINE 💩"}</div>;
};
