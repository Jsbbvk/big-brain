import React, { useState, useEffect } from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import Class from "../../Enums/ClassText";
import ModifierText from "../../Enums/ModifierText";

import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CustomButton from "../../../CustomComponents/CustomButton";
import ClassEnum from "../../Enums/ClassEnum";
import { CSSTransition } from "react-transition-group";
import fadeIn from "../../AnimationStyles/FadeIn.module.scss";
import LinearProgress from "@material-ui/core/LinearProgress";
import MenuController from "../Question/MenuController";

import { set_player_stats } from "../../../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { set_class } from "../../../Socket/player";
import { create_listener, remove_listener } from "../../../Socket/listener";
import Display from "../../Enums/DisplayEnum";
import RoleEnum from "../../Enums/RoleEnum";

const useStyles = (props) =>
  makeStyles((theme) => ({
    classCard: {
      padding: "15px",
      width: "100%",
      backgroundColor: "#d1bcff",
      "&:hover": {
        backgroundColor: "#c7b2f0",
      },
    },
    disabledCard: {
      backgroundColor: "#cab5f1 !important",
    },
    disabledModifier: {
      backgroundColor: "#e6cdf1 !important",
      color: "rgba(0, 0, 0, 0.26)",
    },
    activeClassCard: {
      backgroundColor: "#bea7e3",
      "&:hover": {
        backgroundColor: "#bea7e3",
      },
    },
    modifierCard: {
      textAlign: "left",
      padding: "7px 10px",
      margin: "10px 0",

      [theme.breakpoints.down("sm")]: {
        maxWidth: "300px",
        width: "30vw",
      },
      [theme.breakpoints.down("xs")]: {
        width: "250px",
      },
      maxWidth: "350px",
      width: "40vw",
      backgroundColor: "#f3d7ff",
    },
    selectButton: {
      padding: "10px 15px",
      width: "200px",
      backgroundColor: "#a5ffc1",
      "&:hover": {
        backgroundColor: "#8fdfa8",
      },
    },
    noHover: {
      pointerEvents: "none",
    },
    voteProgressBar: {
      width: "300px",
      height: "10px",
    },
    menuButton: {
      position: "fixed",
      right: "20px",
      top: "20px",
      zIndex: "2",
    },
    textHighlight: {
      background:
        "linear-gradient(90deg, rgba(255,180,180,1) 0%, rgba(180,236,255,1) 100%)",
      padding: "0 3px",
    },
  }));

const ClassDisplay = (props) => {
  const classes = useStyles()();

  const [chosenClass, setChosenClass] = useState(ClassEnum);
  const [selectedClass, setSelectedClass] = useState(ClassEnum);

  //how many players selected their class
  const [numChosen, setNumChosen] = useState([]);

  //the classes available to the player
  const [playerClasses, setPlayerClasses] = useState({});
  //classes that aren't for the player
  const [nonPlayerClasses, setNonPlayerClasses] = useState({});

  const player = useSelector((state) => state.player);
  const roomId = useSelector((state) => state.roomId);
  const dispatch = useDispatch();

  useEffect(() => {
    setChosenClass(ClassEnum.NoClass);
    setSelectedClass(ClassEnum.NoClass);

    if (player.stats.role === RoleEnum.Samaritan) {
      setPlayerClasses(Class.samaritan);
      setNonPlayerClasses(Class.trickster);
    } else if (player.stats.role === RoleEnum.Trickster) {
      setPlayerClasses(Class.trickster);
      setNonPlayerClasses(Class.samaritan);
    }

    return () => {
      remove_listener("player selected class");
    };
  }, []);

  useEffect(() => {
    if (numChosen.length !== 2) return;
    if (numChosen[0] === numChosen[1]) props.switchDisplay(Display.Modifier);
  }, [numChosen]);

  const chooseClass = (classChoice) => {
    setChosenClass((prev) =>
      prev === classChoice ? ClassEnum.NoClass : classChoice
    );
  };

  const confirmButton = async () => {
    let { status: class_status, data: class_data } = await set_class(
      roomId,
      player.uuid,
      chosenClass
    );
    if (class_status !== "success") return;

    dispatch(set_player_stats({ classEnum: chosenClass }));
    setSelectedClass(chosenClass);
    setNumChosen(class_data.numReady);

    create_listener("player selected class", (res) => {
      setNumChosen(res.data.numReady);
    });
  };

  return (
    <Box mt={5} mb={30}>
      <MenuController classes={classes.menuButton} />

      <Box textAlign={"center"}>
        {player.stats.role === RoleEnum.Trickster && (
          <Box mb={2}>
            <Typography variant={"h6"}>
              You are the{" "}
              <Box component={"span"} className={classes.textHighlight}>
                trickster
              </Box>
              !
            </Typography>
          </Box>
        )}
        <Typography variant={"h4"}>Choose a class</Typography>
      </Box>
      <Box mt={6}>
        <Box mb={3} textAlign={"center"}>
          <Typography variant={"h6"}>
            {player.stats.role === RoleEnum.Samaritan
              ? "Samaritan"
              : "Trickster"}{" "}
            Classes
          </Typography>
        </Box>
        <Grid container spacing={5}>
          {Object.entries(playerClasses).map(([key, value]) => (
            <Grid item xs={12} sm={6} key={key}>
              <CustomButton
                className={clsx(
                  classes.classCard,
                  chosenClass === key && classes.activeClassCard,
                  selectedClass !== ClassEnum.NoClass && classes.noHover
                )}
                disableRipple
                onClick={() => chooseClass(key)}
              >
                <Box textAlign={"center"}>
                  <Typography variant={"h5"}>{value.name}</Typography>
                  <br />
                  <Typography variant={"body2"}>Modifiers</Typography>
                  {value.modifiers.map((m, i) => (
                    <Paper
                      elevation={1}
                      key={i}
                      className={classes.modifierCard}
                      dangerouslySetInnerHTML={{
                        __html: ModifierText[m],
                      }}
                    />
                  ))}
                </Box>
              </CustomButton>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box mt={7}>
        <Box mb={3} textAlign={"center"}>
          <Typography variant={"h6"}>
            {player.stats.role !== RoleEnum.Samaritan
              ? "Samaritan"
              : "Trickster"}{" "}
            Classes
          </Typography>
        </Box>
        <Grid container spacing={5}>
          {Object.entries(nonPlayerClasses).map(([key, value]) => (
            <Grid item xs={12} sm={6} key={key}>
              <CustomButton
                disabled
                className={clsx(
                  classes.classCard,
                  classes.noHover,
                  classes.disabledCard
                )}
                disableRipple
              >
                <Box textAlign={"center"}>
                  <Typography variant={"h5"}>{value.name}</Typography>
                  <br />
                  <Typography variant={"body2"}>Modifiers</Typography>
                  {value.modifiers.map((m, i) => (
                    <Paper
                      elevation={1}
                      key={i}
                      className={clsx(
                        classes.modifierCard,
                        classes.disabledModifier
                      )}
                      dangerouslySetInnerHTML={{
                        __html: ModifierText[m],
                      }}
                    />
                  ))}
                </Box>
              </CustomButton>
            </Grid>
          ))}
        </Grid>
      </Box>

      <CSSTransition
        classNames={{ ...fadeIn }}
        in={
          chosenClass !== ClassEnum.NoClass &&
          selectedClass === ClassEnum.NoClass
        }
        timeout={500}
        unmountOnExit
      >
        <Box
          position={"fixed"}
          left={"50%"}
          bottom={"35px"}
          style={{ transform: "translateX(-50%)" }}
        >
          <CustomButton
            className={classes.selectButton}
            disableRipple
            onClick={confirmButton}
          >
            Confirm
          </CustomButton>
        </Box>
      </CSSTransition>

      <Box>
        <CSSTransition
          in={selectedClass !== ClassEnum.NoClass}
          timeout={700}
          classNames={{ ...fadeIn }}
          unmountOnExit
        >
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
              value={
                numChosen.length > 0 ? (numChosen[0] / numChosen[1]) * 100 : 0
              }
              className={classes.voteProgressBar}
            />
            <Box mt={2}>
              {numChosen.length > 0 && (
                <Typography variant={"h5"}>
                  {numChosen[0]} / {numChosen[1]}
                </Typography>
              )}
            </Box>
          </Box>
        </CSSTransition>
      </Box>
    </Box>
  );
};

export default ClassDisplay;
