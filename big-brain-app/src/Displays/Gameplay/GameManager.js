import React, { useEffect, useState } from "react";
import GameScreen from "./GameScreen";
import Question from "./Question/Question";
import Modifier from "./Modifier/Modifier";

import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";

import { CSSTransition, SwitchTransition } from "react-transition-group";

import fadeStyles from "../AnimationStyles/FadeIn.module.scss";

import Displays from "../Enums/DisplayEnum";
import ClassDisplay from "./Class/ClassDisplay";
import WaitingRoom from "../Waiting/WaitingRoom";
import Result from "./Result/Result";

const questionComponent = () => <Question key={Displays.Question} />;
const modifierComponent = () => <Modifier key={Displays.Modifier} />;
const classComponent = () => <ClassDisplay key={Displays.Class} />;
const waitingRoomComponent = () => <WaitingRoom key={Displays.Waiting} />;
const resultComponent = () => <Result key={Displays.Result} />;

import { useSelector, useDispatch } from "react-redux";
import { create_listener, remove_listener } from "../../Socket/listener";
import { init_socket } from "../../Socket/main";

const GameManager = (props) => {
  const [currentDisplayComponent, setCurrDisplayComponent] = useState([]);
  const [currDisplay, setCurrDisplay] = useState(Displays);

  const roomId = useSelector((state) => state.roomId);
  const player = useSelector((state) => state.player);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await init_socket();

      setCurrDisplay(Displays.Waiting);

      create_listener("game end", (res) => {
        switchDisplay(Displays.Waiting);
      });

      create_listener("display results", (res) => {
        let { status } = res;
        if (status !== "success") return;
        switchDisplay(Displays.Result);
      });
    })();

    return () => {
      remove_listener("game end");
      remove_listener("display results");
    };
  }, []);

  useEffect(() => {
    switch (currDisplay) {
      case Displays.Question:
        setCurrDisplayComponent([questionComponent()]);
        break;
      case Displays.Modifier:
        setCurrDisplayComponent([modifierComponent()]);
        break;
      case Displays.Class:
        setCurrDisplayComponent([classComponent()]);
        break;
      case Displays.Waiting:
        setCurrDisplayComponent([waitingRoomComponent()]);
        break;
      case Displays.Result:
        setCurrDisplayComponent([resultComponent()]);
        break;
    }
  }, [currDisplay]);

  const changeProp = () => {
    if (currDisplay === Displays.Modifier) {
      setCurrDisplay(Displays.Class);
    } else {
      setCurrDisplay(Displays.Question);
    }
  };

  const switchDisplay = (display) => {
    setCurrDisplay(display);
  };

  return (
    <React.Fragment>
      <Container>
        <button onClick={() => switchDisplay(Displays.Waiting)}>
          back to start
        </button>
        <SwitchTransition mode={"out-in"}>
          <CSSTransition
            key={currDisplay}
            addEndListener={(node, done) => {
              node.addEventListener("transitionend", done, false);
            }}
            timeout={1000}
            classNames={{ ...fadeStyles }}
          >
            <GameScreen switchDisplay={switchDisplay}>
              {currentDisplayComponent}
            </GameScreen>
          </CSSTransition>
        </SwitchTransition>
      </Container>
    </React.Fragment>
  );
};

export default GameManager;
