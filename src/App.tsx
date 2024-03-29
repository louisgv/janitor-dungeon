import React, { Fragment, useState, useRef, useEffect, Component } from "react";

import OnlineIndicator from "./components/OnlineIndicator";
import Game from "./components/Game";
import HealthBar from "./components/HealthBar";
import Monster from "./components/Monster";
import styled from "styled-components";
import Reward from "react-rewards";
import { CirclesToRhombusesSpinner } from "react-epic-spinners";

import electron from "electron";

const RewardContainer = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
`;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  justify-content: space-evenly;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const App = ({ onReward }: any) => {
  const [isAlive, setIsAlive] = useState(false);

  const setIsAliveRef = useRef((event: Event, state: string) => {
    switch (state) {
      case "newGame":
        setIsAlive(true);
        break;
      case "gameOver":
      default:
        onReward();
        setIsAlive(false);
        break;
    }
  });

  useEffect(() => {
    electron.ipcRenderer.on("app", setIsAliveRef.current);

    return () => {
      // Clean up the subscription
      electron.ipcRenderer.removeListener("app", setIsAliveRef.current);
    };
  });

  return (
    <>
      {isAlive ? (
        <>
          <Monster />
          <HealthBar />
        </>
      ) : (
        <CirclesToRhombusesSpinner
          size={36}
          animationDuration={3600}
          className=""
          style={{}}
          color="black"
        />
      )}

      {/* <OnlineIndicator /> */}
      {/* <Game/> */}
    </>
  );
};

export default class extends Component {
  rewardRef: any;

  handleReward = () => {
    this.rewardRef.rewardMe();
  };

  render() {
    return (
      <Container>
        <RewardContainer>
          <Reward
            type="memphis"
            ref={(ref: any) => {
              this.rewardRef = ref;
              ref.rewardMe();
            }}
          />
        </RewardContainer>
        <App onReward={this.handleReward} />
      </Container>
    );
  }
}
