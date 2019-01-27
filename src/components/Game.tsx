import React, { useState, useEffect } from "react";
import electron from 'electron';

export default () => {
  const [gameSession, setGameSession] = useState({ user: "", message: "" });

  useEffect(() => {
    electron.ipcRenderer.on('message', (data : any)=>{
      setGameSession(data);
    })
  });

  return (
    <div>
      USER : {gameSession.user}
      <br />
      MSG : {gameSession.message}
    </div>
  );
};
