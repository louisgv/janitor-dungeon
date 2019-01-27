import React, { useState, useEffect, useRef } from "react";

import electron from "electron";

export default () => {

  const [gameSession, setGameSession] = useState({ user: "", message: "" });

  const setGameSessionRef = useRef((event: Event, data: any) => {
    setGameSession(data);
  });

  useEffect(() => {

    electron.ipcRenderer.on("message", setGameSessionRef.current)
  
    return () => {
      // Clean up the subscription
      electron.ipcRenderer.removeListener("message", setGameSessionRef.current)
    };
  });
  



  return (
    <div>
      USER : {gameSession.user}
      <br />
      MSG : {gameSession.message}
    </div>
  );
};
