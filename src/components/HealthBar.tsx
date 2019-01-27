import React, { useState, useEffect, useRef } from "react";

import electron from "electron";
import styled from "styled-components";

interface BarProps {
  percentage: number;
}

const Bar = styled.div<BarProps>`
  box-shadow: 0 5px 15px 0px rgba(0,0,0,0.6);
  background: white;
  border-radius: 13px;
  height: 5px;
  width: 450px;
  padding: 3px;

  :after {
    content: '';
    display: block;
    background: black;
    width: ${p=>p.percentage}%;
    height: 100%;
    border-radius: 9px;
}
`

export default ()=>{
  const [health, setHealth] = useState(0)
  
  const setHealthRef = useRef((event: Event, data: any) => {
    setHealth(Math.floor(data.current/data.max * 100));
  });

  useEffect(() => {

    electron.ipcRenderer.on("monsterHealthUpdate", setHealthRef.current)
    
    return () => {
      // Clean up the subscription
      electron.ipcRenderer.removeListener("monsterHealthUpdate", setHealthRef.current)
    };
  });

  return <Bar percentage={Math.floor(health)}/>;
}