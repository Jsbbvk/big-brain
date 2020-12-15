import React, { useEffect, useState } from "react";
import { emission } from "../../../Socket/main";
import { useSelector } from "react-redux";
import Box from "@material-ui/core/Box";
import RoleEnum from "../../Enums/RoleEnum";
import Typography from "@material-ui/core/Typography";
import MenuController from "../Question/MenuController";
import { makeStyles } from "@material-ui/core/styles";
import CustomButton from "../../../CustomComponents/CustomButton";
import Fade from "@material-ui/core/Fade";
import LinearProgress from "@material-ui/core/LinearProgress";
import { create_listener, remove_listener } from "../../../Socket/listener";
import clsx from "clsx";

const useStyles = (props) =>
  makeStyles((theme) => ({
    highlight: {
      background:
        "linear-gradient(90deg, rgba(255,180,180,1) 0%, rgba(180,236,255,1) 100%)",
      padding: "10px",
      wordWrap: "break-word",
    },
    progressBar: {
      width: "300px",
      height: "10px",
    },
    button: {
      padding: "10px 15px",
      width: "200px",
      backgroundColor: "#a5ffc1",
      "&:hover": {
        backgroundColor: "#8fdfa8",
      },
    },
  }));

const Result = (props) => {
  const classes = useStyles()();

  const roomId = useSelector((state) => state.roomId);
  const player = useSelector((state) => state.player);

  const [votedPlayer, setVotedPlayer] = useState(null);
  const [points, setPoints] = useState({});
  const [winner, setWinner] = useState(null);
  const [numReady, setNumReady] = useState([]);

  useEffect(() => {
    emission("get results", { room_id: roomId }).then((res) => {
      let {
        data: { votedPlayer, points, winner },
        status,
      } = res;
      if (status !== "success") return;
      setVotedPlayer(votedPlayer);
      setPoints(points);
      setWinner(winner);
    });

    return () => {
      remove_listener("player continue to end game");
    };
  }, []);

  const onEndGameClick = async () => {
    let res = await emission("continue to end game", {
      room_id: roomId,
      player_uuid: player.uuid,
    });

    if (res.status !== "success") return;
    setNumReady(res.data.numReady);

    create_listener("player continue to end game", (res) => {
      setNumReady(res.data.numReady);
    });
  };

  return (
    <Box mt={5} mb={30}>
      <MenuController />

      <Box textAlign={"center"}>
        <Typography variant={"h3"}>Results</Typography>
      </Box>
      {votedPlayer && (
        <Box mt={3} textAlign={"center"} boxShadow={1}>
          <Typography variant={"h4"} className={classes.highlight}>
            {votedPlayer.username}{" "}
            {
              <b>
                is{" "}
                {votedPlayer.gameplay.role !== RoleEnum.Trickster ? "not " : ""}
              </b>
            }{" "}
            the trickster
          </Typography>
        </Box>
      )}
      <Box textAlign={"center"} mt={4}>
        <Typography variant={"h4"}>Points</Typography>
        <Box mt={1}>
          <Typography variant={"h6"}>
            <Box
              component={"span"}
              className={clsx(
                winner === RoleEnum.Samaritan && classes.highlight
              )}
            >
              Samaritan: {points.samaritan}
            </Box>
          </Typography>
        </Box>
        <Box mt={1}>
          <Typography variant={"h6"}>
            <Box
              component={"span"}
              className={clsx(
                winner === RoleEnum.Trickster && classes.highlight
              )}
            >
              Trickster: {points.trickster}
            </Box>
          </Typography>
        </Box>
      </Box>

      <Fade in={numReady.length === 0} timeout={500} unmountOnExit>
        <Box
          position={"fixed"}
          left={"50%"}
          bottom={"35px"}
          style={{ transform: "translateX(-50%)" }}
        >
          <CustomButton
            className={classes.button}
            disableRipple
            onClick={onEndGameClick}
          >
            End Game?
          </CustomButton>
        </Box>
      </Fade>

      <Fade in={numReady.length !== 0} timeout={500} unmountOnExit>
        <Box
          display={"flex"}
          justifyContent={"center"}
          textAlign={"center"}
          flexDirection={"column"}
          alignItems={"center"}
          position={"fixed"}
          bottom={"35px"}
          left={"50%"}
          style={{
            transform: "translateX(-50%)",
            backgroundColor: "#fafafa",
          }}
          boxShadow={3}
          borderRadius={3}
          p={{ xs: 3, sm: 5 }}
          mt={10}
        >
          <LinearProgress
            variant="determinate"
            value={numReady.length > 0 ? (numReady[0] / numReady[1]) * 100 : 0}
            className={classes.progressBar}
          />
          <Box mt={2}>
            {numReady.length > 0 && (
              <Typography variant={"h5"}>
                {numReady[0]} / {numReady[1]}
              </Typography>
            )}
          </Box>
        </Box>
      </Fade>
    </Box>
  );
};

export default Result;
