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
import WaitingRoom from "./Waiting/WaitingRoom";
import Result from "./Result/Result";
import Starting from "./Starting/Starting";

import { useSelector, useDispatch } from "react-redux";
import { create_listener, remove_listener } from "../../Socket/listener";
import { init_socket } from "../../Socket/main";
import { leave_room } from "../../Socket/rooms";

const questionComponent = () => <Question key={Displays.Question} />;
const modifierComponent = () => <Modifier key={Displays.Modifier} />;
const classComponent = () => <ClassDisplay key={Displays.Class} />;
const waitingRoomComponent = () => <WaitingRoom key={Displays.Waiting} />;
const resultComponent = () => <Result key={Displays.Result} />;
const startingComponent = () => <Starting key={Displays.Start} />;

var player_id = "";
var room_id = "";

const GameManager = (props) => {
    const [currentDisplayComponent, setCurrDisplayComponent] = useState([]);
    const [currDisplay, setCurrDisplay] = useState(Displays);

    const roomId = useSelector((state) => state.roomId);
    const player = useSelector((state) => state.player);
    const dispatch = useDispatch();

    useEffect(() => (player_id = player.uuid), [player]);
    useEffect(() => (room_id = roomId), [roomId]);

    useEffect(() => {
        const leave_on_refresh = function () {
            if (room_id !== "" && player_id !== "")
                leave_room(room_id, player_id);
        };
        window.addEventListener("beforeunload", leave_on_refresh);

        (async () => {
            await init_socket();

            setCurrDisplay(Displays.Start);

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
            window.removeEventListener("beforeunload", leave_on_refresh);
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
            case Displays.Start:
                setCurrDisplayComponent([startingComponent()]);
                break;
        }
    }, [currDisplay]);

    const switchDisplay = (display) => {
        setCurrDisplay(display);
    };

    return (
        <React.Fragment>
            <Container>
                {/* <button onClick={() => switchDisplay(Displays.Waiting)}>
          back to start
        </button> */}
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
