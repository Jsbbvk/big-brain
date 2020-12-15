import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";

import { Box, Typography, Grid } from "@material-ui/core";
import CustomButton from "../../../CustomComponents/CustomButton";
import { get_players, get_room_stats } from "../../../Socket/gameplay";
import { useSelector } from "react-redux";
import { end_game, leave_room } from "../../../Socket/rooms";
import CustomModal from "../../../CustomComponents/CustomModal";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&:focus": {
      outline: "none !important",
    },
  },
  paper: {
    border: "none",
    borderRadius: "5px",
    backgroundColor: "white",
    width: "50vw",
    [theme.breakpoints.down("sm")]: {
      width: "90vw",
    },
    maxWidth: "500px",
    height: "70vh",
    padding: "15px 20px",
    position: "relative",
    "&:focus": {
      outline: "none !important",
    },
  },
  closeButton: {
    position: "absolute",
    right: "7px",
    top: "5px",
    backgroundColor: "#e91e63",
    color: "#fafafa",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#d01d5a",
    },
  },
  button: {
    padding: "8px 12px",
    width: "300px",
  },
  leaveGameButton: {
    backgroundColor: "#ffd9d9",
    "&:hover": {
      backgroundColor: "#f0c7c7",
    },
  },
  endGameButton: {
    backgroundColor: "#d9e9ff",
    "&:hover": {
      backgroundColor: "#cad9ee",
    },
  },
  scrollable: {
    overflowX: "hidden",
    overflowY: "auto",
    maxHeight: "150px",
    padding: "15px 0",
  },
}));

const Menu = (props) => {
  const classes = useStyles();

  const player = useSelector((state) => state.player);
  const roomId = useSelector((state) => state.roomId);

  const [players, setPlayers] = useState([]);
  const [points, setPoints] = useState({});
  const [skipsLeft, setSkipsLeft] = useState();

  const leaveGame = () => {
    leave_room(roomId, player.uuid).then((res) => {
      console.log("success");
      window.location.reload();
    });
  };

  const endGame = () => {
    props.toggleDisplay(false);
    end_game(roomId).then();
  };

  useEffect(() => {
    if (!props.open) return;

    get_players(roomId).then((res) => {
      let { status, data } = res;
      if (status !== "success") return;

      setPlayers(data.players);
    });

    get_room_stats(roomId).then((res) => {
      let { status, data } = res;
      if (status !== "success") return;
      setPoints(data.stats.points);
      setSkipsLeft(data.stats.skipsLeft);
    });
  }, [props.open]);

  return (
    <CustomModal {...props}>
      <Box>
        <Box textAlign={"center"} mt={4} pt={0}>
          <Box>
            <Typography variant={"h5"}>Score</Typography>
            <Box mt={1}>
              <Typography variant={"body1"}>
                Samaritan: {points.samaritan}
              </Typography>
            </Box>
            <Box mt={2}>
              <Typography variant={"body1"}>
                Trickster: {points.trickster}
              </Typography>
            </Box>
          </Box>
          <Box my={2}>
            <hr />
          </Box>
          <Box>
            <Typography variant={"h6"}>Skips Left: {skipsLeft}</Typography>
          </Box>
          <Box my={2}>
            <hr />
          </Box>
          <Box mb={1}>
            <Typography variant={"h5"}>Players</Typography>
          </Box>
          <Box className={classes.scrollable}>
            {players.map((p, i) => (
              <Box
                key={i}
                py={1}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Typography variant={"subtitle2"}>
                  {p.username}
                  {p._id === player.uuid && " (You)"}
                </Typography>
                <Box ml={2}>
                  <img src={`/icons/${i}.svg`} width={32} height={32} />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
        <Box
          position={"absolute"}
          left={"50%"}
          bottom={"25px"}
          style={{ transform: "translateX(-50%)" }}
        >
          <Grid container spacing={8}>
            <Grid item xs={6}>
              <Box
                display={"flex"}
                justifyContent={"center"}
                mx={"auto"}
                position={"relative"}
              >
                <CustomButton
                  className={clsx(classes.button, classes.endGameButton)}
                  onClick={endGame}
                  disableRipple
                >
                  End Game
                </CustomButton>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box
                display={"flex"}
                justifyContent={"center"}
                mx={"auto"}
                position={"relative"}
              >
                <CustomButton
                  className={clsx(classes.button, classes.leaveGameButton)}
                  onClick={leaveGame}
                  disableRipple
                >
                  Leave Game
                </CustomButton>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </CustomModal>
  );
};

export default Menu;
