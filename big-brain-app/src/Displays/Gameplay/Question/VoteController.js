import React, { useState, useEffect } from "react";
import CallVote from "../Vote/CallVote";
import Vote from "../Vote/Vote";
import Box from "@material-ui/core/Box";

import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import clsx from "clsx";
import { call_vote } from "../../../Socket/gameplay";
import { useSelector } from "react-redux";
import { create_listener, remove_listener } from "../../../Socket/listener";

const useStyles = makeStyles({
  button: {
    zIndex: "2",
    backgroundColor: "#fafafa",
    "&:hover": {
      backgroundColor: "#f0f0f0",
    },
  },
});

const VoteController = (props) => {
  const classes = useStyles();
  const roomId = useSelector((state) => state.roomId);
  const [openVote, setOpenVote] = useState(false);
  const [openCallVote, setOpenCallVote] = useState(false);

  const toggleVoteDisplay = (state) => {
    setOpenVote((prevVote) => state || !prevVote);
  };

  const toggleCallVoteDisplay = (state) => {
    setOpenCallVote((prevCallVote) => state || !prevCallVote);
  };

  const callVoteAction = async () => {
    toggleCallVoteDisplay(false);

    await call_vote(roomId);
  };

  useEffect(() => {
    create_listener("called vote", (res) => {
      props.onCallVote();
      toggleVoteDisplay(true);
    });

    return () => {
      remove_listener("called vote");
    };
  }, []);

  return (
    <React.Fragment>
      <Fab
        onClick={() => toggleCallVoteDisplay()}
        className={clsx(classes.button, props.classes)}
        title={"Call a vote"}
        disableRipple
      >
        <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
          <img src={"/call-vote.svg"} width={32} height={32} />
        </Box>
      </Fab>
      <CallVote
        toggleDisplay={toggleCallVoteDisplay}
        open={openCallVote}
        callVote={callVoteAction}
      />
      <Vote
        toggleDisplay={toggleVoteDisplay}
        open={openVote}
        finishVote={props.onFinishVote}
      />
    </React.Fragment>
  );
};

export default VoteController;
