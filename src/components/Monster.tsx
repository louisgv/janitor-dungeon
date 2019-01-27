import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import electron from "electron";

import { getRandomTriangle } from './Triangle'
import Circle from './Circle'
import SpecialShape from './SpecialShape'

const hovering = keyframes`
  0% {
		box-shadow: 0 5px 15px 0px rgba(0,0,0,0.6);
		transform: translatey(0px);
	}
	50% {
		box-shadow: 0 25px 15px 0px rgba(0,0,0,0.2);
		transform: translatey(-20px);
	}
	100% {
		box-shadow: 0 5px 15px 0px rgba(0,0,0,0.6);
		transform: translatey(0px);
	}
`;

const HoveringContainer = styled.div`
  animation: ${hovering} 4s ease-in-out infinite;
  width: 256px;
  height: 256px;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const SwitchMonster = (shape:number, size: number) => {
  switch (shape) {
    case 2:
      const hashShape = SpecialShape({ hash: (0|Math.random()*9e6).toString(36) });  
      return <img src={hashShape.toDataURL()} />;
    case 1:
      return <Circle color="black" size={`${size}px`}/>;
    case 0:
    default:
      const TriangleClass = getRandomTriangle();
      return <TriangleClass color="black"  size={`${size}px`}/>
  }
}

export default () => {

  const [monster, setMonster] = useState({
    level: 0,
    currentHealth: 0,
    maxHealth: 0,
    shape: 0
  });

  const setMonsterRef = useRef((event: Event, monster: any) => {
    setMonster(monster);
  });

  useEffect(() => {
    electron.ipcRenderer.on("newMonster", setMonsterRef.current)
    
    return () => {
      // Clean up the subscription
      electron.ipcRenderer.removeListener("newMonster", setMonsterRef.current)
    };
  });

  return (
    <HoveringContainer>  
      {SwitchMonster(monster.shape, Math.floor(60 + Math.random() * monster.level))}
    </HoveringContainer>
  )
};
