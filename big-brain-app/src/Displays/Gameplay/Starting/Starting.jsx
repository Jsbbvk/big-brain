import React, { useState } from "react";
import { Box, Typography } from "@material-ui/core";
import Footer from "./Footer";
import CreateRoom from "./CreateRoom";
import JoinRoom from "./JoinRoom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import Home from "./Home";
import fadeStyles from "../../AnimationStyles/FadeIn.module.scss";
import Rules from "../Rules/Rules";

const Display = {
    None: 0,
    Create: 1,
    Join: 2,
};

const Starting = (props) => {
    const [display, setDisplay] = useState(Display.None);

    return (
        <Box>
            <Rules />
            <Box textAlign={"center"}>
                <Typography variant={"h3"}>Big Brain</Typography>

                <Box mt={1}>
                    <Typography variant={"body1"}>
                        <i>Or rather, smooth brain</i>
                    </Typography>
                </Box>
            </Box>
            <SwitchTransition mode={"out-in"}>
                <CSSTransition
                    key={display}
                    timeout={250}
                    addEndListener={(node, done) => {
                        node.addEventListener("transitionend", done, false);
                    }}
                    classNames={{ ...fadeStyles }}
                >
                    {display === Display.None ? (
                        <Home setDisplay={setDisplay} />
                    ) : display === Display.Create ? (
                        <CreateRoom
                            setDisplay={setDisplay}
                            switchDisplay={props.switchDisplay}
                        />
                    ) : (
                        <JoinRoom
                            setDisplay={setDisplay}
                            switchDisplay={props.switchDisplay}
                        />
                    )}
                </CSSTransition>
            </SwitchTransition>

            <Footer />
        </Box>
    );
};

export default Starting;
