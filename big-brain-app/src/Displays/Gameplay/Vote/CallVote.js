import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";

import { Box, Typography } from "@material-ui/core";
import CustomModal from "../../../CustomComponents/CustomModal";
import Fab from "@material-ui/core/Fab";
import { get_can_call_vote } from "../../../Socket/gameplay";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  button: {
    height: "150px",
    width: "150px",
    backgroundColor: "#fa9696",
    "&:hover": {
      backgroundColor: "#df8888",
    },
  },
  disabled: {
    pointerEvents: "none",
    opacity: "40%",
  },
}));

const CallVote = (props) => {
  const classes = useStyles();
  const roomId = useSelector((state) => state.roomId);
  const [canVote, setCanVote] = useState(true);
  const [callVoteThisTurn, setCallVoteThisTurn] = useState(false);

  useEffect(() => {
    get_can_call_vote(roomId).then((res) => {
      let { data, status } = res;
      if (status !== "success") return;
      setCanVote(data.canCallVote.allow);
      setCallVoteThisTurn(data.canCallVote.numRounds === 0);
    });
  });

  return (
    <CustomModal {...props}>
      <Box textAlign={"center"} mt={10}>
        <Typography variant={"h4"}>
          {canVote ? "Call a vote?" : "Cannot call a vote"}
        </Typography>
        <Box mt={2}>
          <Typography variant={"body1"}>
            {canVote
              ? "If you call a vote, you cannot call another vote during the next round"
              : callVoteThisTurn
              ? "Vote already called this round"
              : "You can call a vote during the next round"}
          </Typography>
        </Box>
        <Box mt={4}>
          <Fab
            onClick={() => canVote && props.callVote()}
            className={clsx(classes.button, !canVote && classes.disabled)}
            size={"large"}
            title={"Call a vote"}
          >
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <img src={"/call-vote.svg"} width={72} height={72} />
            </Box>
          </Fab>
        </Box>
      </Box>
    </CustomModal>
  );
};

export default CallVote;
