import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CustomModal from "../../../CustomComponents/CustomModal";
import { Typography, Fab, Box } from "@material-ui/core";
import clsx from "clsx";

const useStyles = makeStyles({
    topLeft: {
        position: "fixed",
        left: "20px",
        top: "20px",
        zIndex: "2",
        backgroundColor: "#fafafa",
        "&:hover": {
            backgroundColor: "#f0f0f0",
        },
    },
    scrollable: {
        overflowX: "hidden",
        overflowY: "auto",
        maxHeight: "380px",
        padding: "15px 25px",
    },
});

export default function Rules(props) {
    const classes = useStyles();

    const [openRules, setOpenRules] = useState(false);
    const toggleRulesDisplay = (state) => {
        setOpenRules((prev) => state || !prev);
    };
    return (
        <>
            <Fab
                onClick={() => toggleRulesDisplay()}
                className={clsx(classes.topLeft)}
                title={"Rules"}
                disableRipple
            >
                <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                >
                    <img src={"/rules.svg"} width={32} height={32} />
                </Box>
            </Fab>
            <CustomModal toggleDisplay={toggleRulesDisplay} open={openRules}>
                <Box textAlign={"center"} mt={3}>
                    <Typography variant={"h5"}>Rules</Typography>
                    <Box
                        mt={2}
                        textAlign={"left"}
                        className={classes.scrollable}
                    >
                        <Typography variant={"body2"}>
                            <b>Objective</b>
                            <br />
                            The objective of <i>Big Brain</i> is to correctly
                            and unanimously answer the trivia question each
                            round.
                            <br />
                            <br />
                            <b>Players</b>
                            <br />
                            All players are "Samaritans" and they try to work
                            together to answer correctly. There will be one
                            player who will be a "Trickster," who tries to have
                            the Samaritans unanimously choose the wrong answer.
                            <br />
                            Samaritans need <b>5</b> points to win.
                            <br />
                            The Trickster needs <b>3</b> points to win.
                            <br />
                            <br />
                            <b>Rounds</b>
                            <br />
                            Each round will display a trivia question along with
                            two answers where only one is correct. Players will
                            have a time limit of 45 seconds to select an answer
                            before the game automatically chooses a random
                            answer. The Trickster has an advantage and{" "}
                            <b>can see the correct answer</b>, and they can
                            attempt to sway the consensus.
                            <br />
                            Depending on the players' answers, there are 3
                            outcomes:
                            <br />
                            <b>Unanimous Correct Answer</b>
                            <br />
                            If all players (trickster included) choose the right
                            answer, then the Samaritans gain a point. The
                            correct answer along with all players' selections
                            are revealed.
                            <br />
                            <b>Unanimous Incorrect Answer</b>
                            <br />
                            If all players choose the incorrect answer, then the
                            Trickster gains a point. The correct answer along
                            with all players' selections are revealed.
                            <br />
                            <b>No Unanimous Answer</b>
                            <br />
                            If there is not a unanimous selection, then the
                            round is "<b>skipped</b>" and no points are awarded.
                            When a round is skipped, the correct answer won't be
                            shown but all players' selections will be. However,
                            there are only <b>3</b> skips and when all skips are
                            used up, the chosen answer will be option with most
                            selections. In the case of a tie, the Trickster
                            gains a point.
                            <br />
                            <br />
                            <b>Modifiers</b>
                            <br />
                            Before the game starts, all players will be able to
                            choose a "class" that has 6-7 <b>modifiers</b>.
                            Players will not be able to change their class after
                            selecting it.
                            <br />
                            Before each round, players can select a modifier to
                            play for that round. Each modifier can only be used
                            once. Modifiers have different effects, and can
                            change the round entirely (such as decreasing the
                            round duration). However,{" "}
                            <b>
                                you have the option to play without a modifier
                            </b>
                            .
                            <br />
                            When the question display is shown, clicking on the
                            "lightning" button at top left will show your
                            current modifier (if you chose to play one).
                            <br />
                            <br />
                            <b>Calling a Vote</b>
                            <br />
                            At any time during the round, any player can{" "}
                            <b>call a vote</b>. The round will be paused and a
                            voting screen will appear for all players. Players
                            have the option to vote for who they think the
                            Trickster is, or they can <b>skip vote</b>. If there
                            is a majority vote of a player, and they are the
                            Trickster, the Samaritans automatically win.
                            Otherwise, voting the wrong player will result in a
                            Trickster's victory. If the vote is skipped and
                            there is not a majority vote, the round resumes.
                            However, calling a vote will disabled the "call
                            vote" button for 1 round. That way, players cannot
                            call a vote each round.
                        </Typography>
                    </Box>
                </Box>
            </CustomModal>
        </>
    );
}
