import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CustomButton from "../../../CustomComponents/CustomButton";
import clsx from "clsx";
import ModifierEnum from "../../Enums/ModifierEnum";
import ModifierText from "../../Enums/ModifierText";
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

import { CSSTransition } from "react-transition-group";
import fadeIn from "../../AnimationStyles/FadeIn.module.scss";
import { set_modifier } from "../../../Socket/player";
import { useDispatch, useSelector } from "react-redux";
import { set_player_stats } from "../../../../redux/actions";
import { create_listener, remove_listener } from "../../../Socket/listener";
import Display from "../../Enums/DisplayEnum";
import MenuController from "../Question/MenuController";
import Class from "../../Enums/ClassText";
import RoleEnum from "../../Enums/RoleEnum";

const useStyles = (props) =>
  makeStyles((theme) => ({
    voteProgressBar: {
      width: "300px",
      height: "10px",
    },
    modifierButton: {
      padding: "15px 20px",
      [theme.breakpoints.down("xs")]: {
        width: "300px",
      },
      width: "500px",
      margin: "10px",
      textAlign: "left",
      justifyContent: "left",
      backgroundColor: "#f7f7f7",
      "&:hover": {
        backgroundColor: "#fde2ff",
      },
    },
    activeModifierButton: {
      backgroundColor: "#f1d6f3",
      "&:hover": {
        backgroundColor: "#f1d6f3",
      },
    },
    disabledModifierButton: {
      backgroundColor: "#c8b1c9",
      "&:hover": {
        backgroundColor: "#c8b1c9",
      },
    },
    noHover: {
      pointerEvents: "none",
    },
    selectButton: {
      padding: "10px 15px",
      width: "200px",
      position: "fixed",
      left: "50%",
      bottom: "50px",
      transform: "translateX(-50%)",
      backgroundColor:
        props.chosenModifier === ModifierEnum.NoModifier
          ? "#fcdc96"
          : "#b4ffcb",
      "&:hover": {
        backgroundColor:
          props.chosenModifier === ModifierEnum.NoModifier
            ? "#f0ce7f"
            : "#95ebaf",
      },
    },
    textHighlight: {
      background:
        "linear-gradient(90deg, rgba(255,180,180,1) 0%, rgba(180,236,255,1) 100%)",
      padding: "0 3px",
      marginLeft: "3px",
    },
  }));

//TODO keep track of used modifiers
// and display used modifiers as disabled

//NOTE this page displays the player's class's modifiers to choose from
const Modifier = (props) => {
  const [modifiers, setModifiers] = useState([]);
  //chosen modifier option
  const [chosenModifier, setChosenModifier] = useState(ModifierEnum);
  //confirmed modifier
  const [selectedModifier, setSelectedModifier] = useState(null);

  //how many players selected a modifier
  const [numChosen, setNumChosen] = useState([]);

  const classes = useStyles({ chosenModifier })();

  const player = useSelector((state) => state.player);
  const roomId = useSelector((state) => state.roomId);
  const dispatch = useDispatch();

  useEffect(() => {
    setChosenModifier(ModifierEnum.NoModifier);
    setModifiers(
      Class[
        player.stats.role === RoleEnum.Samaritan ? "samaritan" : "trickster"
      ][player.stats.classEnum].modifiers
    );

    create_listener("finish question setup", (res) => {
      props.switchDisplay(Display.Question);
    });

    return () => {
      remove_listener("player selected modifier");
      remove_listener("finish question setup");
    };
  }, []);

  const chooseModifierOption = (modifier) => {
    if (selectedModifier !== null) return;

    setChosenModifier((prev) =>
      prev === modifier ? ModifierEnum.NoModifier : modifier
    );
  };

  const selectModifier = async () => {
    let { status: class_status, data: class_data } = await set_modifier(
      roomId,
      player.uuid,
      chosenModifier
    );
    if (class_status !== "success") return;

    dispatch(set_player_stats({ modifierEnum: chosenModifier }));
    setSelectedModifier(chosenModifier);
    setNumChosen(class_data.numReady);

    create_listener("player selected modifier", (res) => {
      setNumChosen(res.data.numReady);
    });
  };

  return (
    <Box
      mt={5}
      mb={30}
      display={"flex"}
      justifyContent={"center"}
      textAlign={"center"}
      flexDirection={"column"}
    >
      <MenuController />
      <Typography variant={"subtitle1"}>
        Class:{" "}
        {
          Class[
            player.stats.role === RoleEnum.Samaritan ? "samaritan" : "trickster"
          ][player.stats.classEnum].name
        }
        {player.stats.role === RoleEnum.Trickster && (
          <Box component={"span"} className={classes.textHighlight}>
            (trickster)
          </Box>
        )}
      </Typography>
      <Typography variant={"h4"}>Play a modifier</Typography>
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
        mt={4}
      >
        {modifiers.map(
          (mo, i) =>
            !player.stats.prevModifiers.includes(mo) && (
              <CustomButton
                disableRipple
                key={i}
                className={clsx(
                  classes.modifierButton,
                  chosenModifier === mo && classes.activeModifierButton,
                  selectedModifier !== null && classes.noHover
                )}
                onClick={() => chooseModifierOption(mo)}
                innerText={ModifierText[mo]}
              />
            )
        )}
        {player.stats.prevModifiers.length !== 0 && (
          <Box my={2} textAlign={"center"}>
            <Typography variant={"h6"}>Used Modifiers</Typography>
          </Box>
        )}
        {player.stats.prevModifiers.map((mo, i) => (
          <CustomButton
            disableRipple
            key={i}
            className={clsx(
              classes.modifierButton,
              classes.noHover,
              classes.disabledModifierButton
            )}
            innerText={ModifierText[mo]}
          />
        ))}
      </Box>

      <Box>
        <CSSTransition
          in={selectedModifier !== null}
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
            bottom={"8%"}
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

      <CSSTransition
        in={selectedModifier === null}
        timeout={500}
        classNames={{ ...fadeIn }}
        unmountOnExit
      >
        <Box>
          <CustomButton
            className={classes.selectButton}
            disableRipple
            onClick={selectModifier}
          >
            {chosenModifier === ModifierEnum.NoModifier
              ? "Play without modifier"
              : "Confirm modifier"}
          </CustomButton>
        </Box>
      </CSSTransition>
    </Box>
  );
};

export default Modifier;
