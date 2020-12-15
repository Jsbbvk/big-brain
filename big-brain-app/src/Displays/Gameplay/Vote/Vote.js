import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";

import CustomModal from "../../../CustomComponents/CustomModal";
import { Box, Typography } from "@material-ui/core";
import { useSelector } from "react-redux";
import { get_players } from "../../../Socket/gameplay";
import LinearProgress from "@material-ui/core/LinearProgress";
import CustomButton from "../../../CustomComponents/CustomButton";
import Fade from "@material-ui/core/Fade";
import { create_listener, remove_listener } from "../../../Socket/listener";
import { emission } from "../../../Socket/main";

const useStyles = makeStyles(() => ({
  scrollable: {
    overflowX: "hidden",
    overflowY: "auto",
    maxHeight: "180px",
    padding: "15px 0",
  },
  card: {
    backgroundColor: "#fafafa",
    transition: "backgroundColor 500ms ease-in-out",
  },
  selectedCard: {
    backgroundColor: "#ecfdff",
  },
  voteProgressBar: {
    width: "200px",
    height: "6px",
  },
  button: {
    padding: "5px 7px",
    fontSize: "0.8em",
    backgroundColor: "#fec9c9",
    "&:hover": {
      backgroundColor: "#f5c4c4",
    },
  },
  continueButton: {
    padding: "10px 15px",
    width: "200px",
    position: "fixed",
    left: "50%",
    bottom: "50px",
    transform: "translateX(-50%)",
    backgroundColor: "#a5ffc1",
    "&:hover": {
      backgroundColor: "#8fdfa8",
    },
  },
}));

const SKIP = "skip_voting";

const Vote = (props) => {
  const classes = useStyles();

  const player = useSelector((state) => state.player);
  const roomId = useSelector((state) => state.roomId);

  //num players voted
  const [numReady, setNumReady] = useState([]);
  //num players press continue button
  const [numContinue, setNumContinue] = useState([]);

  const [players, setPlayers] = useState([]);
  const [votedPlayerId, setVotedPlayerId] = useState();
  const [voted, setVoted] = useState(false);
  const [voteResults, setVoteResults] = useState([]);

  useEffect(() => {
    get_players(roomId).then((res) => {
      let { status, data } = res;
      if (status !== "success") return;

      setPlayers(data.players);
    });

    create_listener("all players voted", (res) => {
      if (res.status !== "success") return;
      let {
        data: { votedPlayers },
      } = res;

      setVoteResults(votedPlayers);
    });

    return () => {
      remove_listener("all players voted");
      remove_listener("player voted");
      remove_listener("player finish voting");
    };
  }, []);

  useEffect(() => {
    if (numContinue.length !== 2) return;
    if (numContinue[0] === numContinue[1]) {
      props.toggleDisplay(false);
      props.finishVote();
    }
  }, [numContinue]);

  const onVotePlayer = async (player_uuid) => {
    if (voted) return;

    setVoted(true);
    setVotedPlayerId(player_uuid);

    let res = await emission("vote player", {
      player_uuid: player.uuid,
      room_id: roomId,
      voted_player: player_uuid,
    });

    if (res.status !== "success") return;
    setNumReady(res.data.numReady);

    create_listener("player voted", (res) => {
      setNumReady(res.data.numReady);
    });
  };

  const onContinueClick = async () => {
    let res = await emission("finish voting", {
      room_id: roomId,
      player_uuid: player.uuid,
    });
    if (res.status !== "success") return;

    setNumContinue(res.data.numReady);

    create_listener("player finish voting", (res) => {
      setNumContinue(res.data.numReady);
    });
  };

  return (
    <CustomModal
      {...props}
      disable={{
        disableEscapeKeyDown: true,
        disableBackdropClick: true,
      }}
      disableCloseButton={true}
    >
      <Box textAlign={"center"} mt={3}>
        <Typography variant={"h5"}>Vote for the trickster!</Typography>
      </Box>
      <Box textAlign={"center"} py={2} px={3}>
        <Box
          mx={"auto"}
          py={1}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          boxShadow={1}
          style={{ minWidth: "70%", maxWidth: "350px" }}
          className={clsx(classes.card)}
          pb={2}
          mb={2}
          position={"relative"}
        >
          <Typography variant={"subtitle2"}>{player.name} (You)</Typography>
          <Box ml={2}>
            <img
              src={`/icons/${player.stats.index}.svg`}
              width={32}
              height={32}
            />
          </Box>
          <Fade
            in={
              voteResults[player.stats.index] != null &&
              voteResults.length !== 0
            }
            timeout={500}
            unmountOnExit={true}
          >
            <Box
              position={"absolute"}
              left={"50%"}
              bottom={"0"}
              style={{ transform: "translateX(-50%)" }}
              display={"flex"}
              justifyContent={"center"}
            >
              {voteResults[player.stats.index] &&
                voteResults[player.stats.index].map((idx, i) => (
                  <span key={i}>
                    <img src={`/icons/${idx}.svg`} height={16} width={16} />
                  </span>
                ))}
            </Box>
          </Fade>
        </Box>

        <hr />

        <Box my={2} width={"200px"} mx={"auto"}>
          <Box
            boxShadow={1}
            borderRadius={2}
            textAlign={"center"}
            pt={1}
            pb={1}
            className={clsx(
              classes.card,
              votedPlayerId === SKIP && classes.selectedCard
            )}
            position={"relative"}
          >
            <Typography variant={"h6"}>Skip Vote?</Typography>
            <Box mt={2}>
              <Fade in={!voted} timeout={500} unmountOnExit={true}>
                <CustomButton
                  disableRipple
                  disableElevation
                  className={clsx(classes.button)}
                  onClick={() => onVotePlayer(SKIP)}
                >
                  Skip?
                </CustomButton>
              </Fade>
              <Fade
                in={
                  voteResults[voteResults.length - 1] != null &&
                  voteResults.length !== 0
                }
                timeout={500}
                unmountOnExit={true}
              >
                <Box
                  position={"absolute"}
                  left={"50%"}
                  bottom={"0"}
                  style={{ transform: "translateX(-50%)" }}
                  display={"flex"}
                  justifyContent={"center"}
                >
                  {voteResults[voteResults.length - 1] &&
                    voteResults[voteResults.length - 1].map((idx, i) => (
                      <span key={i}>
                        <img src={`/icons/${idx}.svg`} height={16} width={16} />
                      </span>
                    ))}
                </Box>
              </Fade>
            </Box>
          </Box>
        </Box>

        <Typography variant={"h6"}>Players</Typography>

        <Box
          display={"flex"}
          alignItems={"center"}
          flexDirection={"column"}
          className={clsx(classes.scrollable)}
        >
          {players.map(
            (p, i) =>
              p._id !== player.uuid && (
                <Box
                  key={i}
                  py={1}
                  px={2}
                  my={1}
                  style={{ minWidth: "80%", maxWidth: "350px" }}
                  boxShadow={1}
                  borderRadius={2}
                  className={clsx(
                    classes.card,
                    votedPlayerId === p._id && classes.selectedCard
                  )}
                  position={"relative"}
                >
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <Typography variant={"subtitle2"}>{p.username}</Typography>
                    <Box ml={2}>
                      <img src={`/icons/${i}.svg`} width={32} height={32} />
                    </Box>
                  </Box>
                  <Box my={1}>
                    <Fade in={!voted} timeout={500} unmountOnExit={true}>
                      <CustomButton
                        disableRipple
                        disableElevation
                        className={clsx(classes.button)}
                        onClick={() => onVotePlayer(p._id)}
                      >
                        Vote
                      </CustomButton>
                    </Fade>
                    <Fade
                      in={voteResults[i] && voteResults.length !== 0}
                      timeout={500}
                      unmountOnExit={true}
                    >
                      <Box
                        position={"absolute"}
                        left={"50%"}
                        bottom={"0"}
                        style={{ transform: "translateX(-50%)" }}
                        display={"flex"}
                        justifyContent={"center"}
                      >
                        {voteResults[i] &&
                          voteResults[i].map((idx, j) => (
                            <span key={j}>
                              <img
                                src={`/icons/${idx}.svg`}
                                height={16}
                                width={16}
                              />
                            </span>
                          ))}
                      </Box>
                    </Fade>
                  </Box>
                </Box>
              )
          )}
        </Box>
      </Box>

      <Fade
        in={
          numReady.length !== 0 &&
          voteResults.length === 0 &&
          numContinue.length === 0
        }
        timeout={500}
        unmountOnExit={true}
      >
        <Box
          display={"flex"}
          justifyContent={"center"}
          textAlign={"center"}
          flexDirection={"column"}
          alignItems={"center"}
          position={"fixed"}
          bottom={"3%"}
          left={"50%"}
          style={{
            transform: "translateX(-50%)",
            backgroundColor: "#fafafa",
          }}
          boxShadow={3}
          borderRadius={3}
          p={{ xs: 2, sm: 3 }}
        >
          <LinearProgress
            variant="determinate"
            value={numReady.length > 0 ? (numReady[0] / numReady[1]) * 100 : 0}
            className={classes.voteProgressBar}
          />
          <Box mt={1}>
            {numReady.length > 0 && (
              <Typography variant={"h6"}>
                {numReady[0]} / {numReady[1]}
              </Typography>
            )}
          </Box>
        </Box>
      </Fade>

      <Fade in={voteResults.length !== 0} timeout={500} unmountOnExit={true}>
        <Box display={"flex"} justifyContent={"center"}>
          <CustomButton
            onClick={onContinueClick}
            className={clsx(classes.continueButton)}
            style={{ width: "175px" }}
            disableRipple={true}
          >
            Continue
          </CustomButton>
        </Box>
      </Fade>

      <Fade in={numContinue.length !== 0} timeout={500} unmountOnExit={true}>
        <Box
          display={"flex"}
          justifyContent={"center"}
          textAlign={"center"}
          flexDirection={"column"}
          alignItems={"center"}
          position={"fixed"}
          bottom={"3%"}
          left={"50%"}
          style={{
            transform: "translateX(-50%)",
            backgroundColor: "#fafafa",
          }}
          boxShadow={3}
          borderRadius={3}
          p={{ xs: 2, sm: 3 }}
        >
          <LinearProgress
            variant="determinate"
            value={
              numContinue.length > 0
                ? (numContinue[0] / numContinue[1]) * 100
                : 0
            }
            className={classes.voteProgressBar}
          />
          <Box mt={1}>
            {numContinue.length > 0 && (
              <Typography variant={"h6"}>
                {numContinue[0]} / {numContinue[1]}
              </Typography>
            )}
          </Box>
        </Box>
      </Fade>
    </CustomModal>
  );
};

export default Vote;
