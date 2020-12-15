import React, { useState, useEffect } from "react";
import clsx from "clsx";
import Typography from "@material-ui/core/Typography";
import CustomButton from "../../../CustomComponents/CustomButton";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Fade from "@material-ui/core/Fade";

import { CSSTransition } from "react-transition-group";
import slideInTop from "../../AnimationStyles/SlideInTop.module.scss";
import slideInLeft from "../../AnimationStyles/SlideInLeft.module.scss";
import slideInRight from "../../AnimationStyles/SlideInRight.module.scss";
import fadeIn from "../../AnimationStyles/FadeIn.module.scss";
import styles, { buttonStyles } from "./QuestionStyles";

import Display from "../../Enums/DisplayEnum";
import AnswerChoiceEnum from "../../Enums/AnswerChoiceEnum";
import VoteController from "./VoteController";
import MenuController from "./MenuController";
import ModifierController from "./ModifierController";
import { continue_to_next_round, set_answer } from "../../../Socket/player";
import { useDispatch, useSelector } from "react-redux";
import { set_player_stats } from "../../../../redux/actions";
import { create_listener, remove_listener } from "../../../Socket/listener";
import ModifierEnum from "../../Enums/ModifierEnum";
import {
  get_question,
  get_skips_left,
  get_timer,
} from "../../../Socket/gameplay";
import RoleEnum from "../../Enums/RoleEnum";
import Timer from "./Timer/Timer";

//TODO have button that opens a modal to allow the
// user to see their active modifier

const Question = (props) => {
  const [animIn, setAnim] = useState(false);

  const [timerDuration, setTimerDuration] = useState(45);
  const [stopTimer, setStopTimer] = useState(false);
  const [pauseTimer, setPauseTimer] = useState(false);

  const [questionText, setQuestionText] = useState("");
  //whichever option user chooses
  const [answerChoice, setAnswerChoice] = useState(AnswerChoiceEnum);
  //answer options
  const [answersText, setAnswersText] = useState([]);
  //correct answer enum (for tricksters)
  const [correctAnswerEnum, setCorrectAnswerEnum] = useState(AnswerChoiceEnum);
  //selected answer
  const [selectedAnswer, setSelectedAnswer] = useState(AnswerChoiceEnum);

  //num players chose answer [numChosen, totalNum]
  const [numChosen, setNumChosen] = useState([]);

  //player ids and their choices
  const [playerChoices, setPlayerChoices] = useState([]);

  //num players ready for next round [numReady, totalNum]
  const [numReady, setNumReady] = useState([]);

  const [skipsLeft, setSkipsLeft] = useState(3);
  const [skipUsed, setSkipUsed] = useState(false);
  const [skipsLeftInGame, setSkipsLeftInGame] = useState(true);

  const [pointsAwarded, setPointsAwarded] = useState({
    to: "",
    points: 0,
  });

  const classes = styles();

  const player = useSelector((state) => state.player);
  const room = useSelector((state) => state.room);
  const roomId = useSelector((state) => state.roomId);
  const dispatch = useDispatch();

  const answer1Style = buttonStyles({
    tertiary: "#fc1e1e2b",
    secondary: "#fc1e1e6b",
    primary: "#fe6e6e",
    correct: correctAnswerEnum === AnswerChoiceEnum.Answer1,
  })();

  const answer2Style = buttonStyles({
    tertiary: "#a4d2f92b",
    secondary: "#a4d2f96b",
    primary: "#a4d2f9",
    correct: correctAnswerEnum === AnswerChoiceEnum.Answer2,
  })();

  useEffect(() => {
    setSelectedAnswer(AnswerChoiceEnum.NoAnswer);
    setAnswerChoice(AnswerChoiceEnum.NoAnswer);
    setCorrectAnswerEnum(AnswerChoiceEnum.NoAnswer);
    setAnim(true);

    if (player.stats.modifierEnum !== ModifierEnum.NoModifier)
      dispatch(
        set_player_stats({
          prevModifiers: [
            ...player.stats.prevModifiers,
            player.stats.modifierEnum,
          ],
        })
      );

    get_question(roomId).then((res) => {
      if (res.status !== "success") return;
      setQuestionText(res.data.question);
      setAnswersText(res.data.answers.options);
      setCorrectAnswerEnum(
        player.stats.role === RoleEnum.Trickster
          ? res.data.answers.correctEnum
          : AnswerChoiceEnum.NoAnswer
      );
    });

    get_timer(roomId).then((res) => {
      if (res.status !== "success") return;
      setTimerDuration(res.data.timer.duration);
    });

    get_skips_left(roomId).then((res) => {
      if (res.status !== "success") return;
      setSkipsLeft(res.data.skipsLeft);
    });

    create_listener("calculated player answers", (res) => {
      let {
        data: { answers, answerEnum, skipsLeft: skips, pointsAwarded: points },
        status,
      } = res;

      //todo display how many points awarded - even for skips!

      setStopTimer(true);

      if (status !== "success") return;
      setPlayerChoices(answers);

      if (points) setPointsAwarded(points);

      if (answerEnum !== undefined) setCorrectAnswerEnum(answerEnum);

      if (skips || skips >= 0) {
        setSkipUsed(true);
        if (skips >= 0) setSkipsLeft(skips);
        else if (skips === -1) setSkipsLeftInGame(false);
      }
    });

    create_listener("start next round", (res) => {
      props.switchDisplay(Display.Modifier);
    });

    return () => {
      remove_listener("player selected answer");
      remove_listener("calculated player answers");
      remove_listener("start next round");
      remove_listener("player continue to next round");
    };
  }, []);

  const calledVote = () => {
    setPauseTimer(true);
  };

  const finishCallingVote = () => {
    setPauseTimer(false);
  };

  //when player selects an answer option
  const answerButtonClick = (answerC) => {
    if (selectedAnswer !== AnswerChoiceEnum.NoAnswer) return;
    setAnswerChoice((prev) =>
      prev !== answerC ? answerC : AnswerChoiceEnum.NoAnswer
    );
  };

  //when player "confirms" their option
  const answerSelectClick = async (answ = null) => {
    if (answ !== null) setAnswerChoice(answ);
    const answer = answ !== null ? answ : answerChoice;
    let { status, data } = await set_answer(roomId, player.uuid, answer);
    if (status !== "success") {
      console.log(status);
      return;
    }

    setSelectedAnswer(answer);
    dispatch(set_player_stats({ answerEnum: answer }));
    setNumChosen(data.numReady);

    create_listener("player selected answer", (res) => {
      setNumChosen(res.data.numReady);
    });
  };

  //when player clicks "ready" for next round
  const continueClick = async () => {
    let { status, data } = await continue_to_next_round(roomId, player.uuid);
    if (status !== "success") return;

    setNumReady(data.numReady);

    create_listener("player continue to next round", (res) => {
      setNumReady(res.data.numReady);
    });
  };

  const timeUp = async () => {
    await answerSelectClick(
      Math.random() < 0.5 ? AnswerChoiceEnum.Answer1 : AnswerChoiceEnum.Answer2
    );
  };

  return (
    <Box style={{ paddingTop: "0" }} mb={30}>
      <CSSTransition in={animIn} timeout={500} classNames={{ ...fadeIn }}>
        <Box>
          {/*TODO pass in more props*/}
          <VoteController
            classes={classes.voteButton}
            onCallVote={calledVote}
            onFinishVote={finishCallingVote}
          />
          {player.stats.modifierEnum !== ModifierEnum.NoModifier && (
            <ModifierController classes={classes.modifierButton} />
          )}
          <MenuController classes={classes.menuButton} />
        </Box>
      </CSSTransition>

      <CSSTransition
        in={animIn}
        timeout={1000}
        classNames={{ ...slideInTop }}
        unmountOnExit
      >
        <Timer
          duration={timerDuration}
          timeUp={timeUp}
          stop={stopTimer}
          pause={pauseTimer}
        />
      </CSSTransition>

      <CSSTransition in={animIn} timeout={1000} classNames={{ ...fadeIn }}>
        <Box
          boxShadow={3}
          borderRadius={3}
          p={{ xs: 2, sm: 3 }}
          pt={5}
          mt={5}
          className={classes.paper}
        >
          <Typography dangerouslySetInnerHTML={{ __html: questionText }} />
        </Box>
      </CSSTransition>

      <Box mt={6}>
        <Grid container spacing={3} className={classes.overflowHidden}>
          <Grid item xs={12} sm={6}>
            <CSSTransition
              in={animIn}
              timeout={1000}
              classNames={{ ...slideInLeft }}
            >
              <Box
                display={"flex"}
                justifyContent={"center"}
                mx={"auto"}
                position={"relative"}
              >
                <CustomButton
                  className={clsx(
                    classes.button,
                    answerChoice === AnswerChoiceEnum.Answer1 &&
                      answer1Style.buttonActive,
                    selectedAnswer !== AnswerChoiceEnum.NoAnswer &&
                      answer1Style.noButtonHover,
                    selectedAnswer === AnswerChoiceEnum.Answer1 &&
                      answer1Style.buttonSelect,
                    answer1Style.button
                  )}
                  disableRipple={true}
                  onClick={() => answerButtonClick(AnswerChoiceEnum.Answer1)}
                  innerText={answersText[AnswerChoiceEnum.Answer1]}
                />
                <CSSTransition
                  in={playerChoices.length !== 0}
                  timeout={500}
                  classNames={{ ...fadeIn }}
                >
                  <Box
                    position={"absolute"}
                    left={"50%"}
                    bottom={"0"}
                    style={{ transform: "translateX(-50%)" }}
                    display={"flex"}
                    justifyContent={"center"}
                  >
                    {playerChoices[AnswerChoiceEnum.Answer1] &&
                      playerChoices[AnswerChoiceEnum.Answer1].map((p, i) => (
                        <span key={i}>
                          <img
                            src={`/icons/${p.index}.svg`}
                            height={20}
                            width={20}
                          />
                        </span>
                      ))}
                  </Box>
                </CSSTransition>
              </Box>
            </CSSTransition>
          </Grid>
          <Grid item xs={12} sm={6}>
            <CSSTransition
              in={animIn}
              timeout={1000}
              classNames={{ ...slideInRight }}
            >
              <Box
                display={"flex"}
                position={"relative"}
                justifyContent={"center"}
                mx={"auto"}
              >
                <CustomButton
                  className={clsx(
                    classes.button,
                    answer2Style.button,
                    answerChoice === AnswerChoiceEnum.Answer2 &&
                      answer2Style.buttonActive,
                    selectedAnswer !== AnswerChoiceEnum.NoAnswer &&
                      answer2Style.noButtonHover,
                    selectedAnswer === AnswerChoiceEnum.Answer2 &&
                      answer2Style.buttonSelect
                  )}
                  disableRipple={true}
                  onClick={() => answerButtonClick(AnswerChoiceEnum.Answer2)}
                  innerText={answersText[AnswerChoiceEnum.Answer2]}
                />
                <CSSTransition
                  in={playerChoices.length !== 0}
                  timeout={500}
                  classNames={{ ...fadeIn }}
                >
                  <Box
                    position={"absolute"}
                    left={"50%"}
                    bottom={"0"}
                    style={{ transform: "translateX(-50%)" }}
                    display={"flex"}
                    justifyContent={"center"}
                  >
                    {playerChoices[AnswerChoiceEnum.Answer2] &&
                      playerChoices[AnswerChoiceEnum.Answer2].map((p, i) => (
                        <span key={i}>
                          <img
                            src={`/icons/${p.index}.svg`}
                            height={20}
                            width={20}
                          />
                        </span>
                      ))}
                  </Box>
                </CSSTransition>
              </Box>
            </CSSTransition>
          </Grid>
        </Grid>
        <Fade in={pointsAwarded.to !== ""} timeout={500} unmountOnExit>
          <Box mt={4} textAlign={"center"}>
            <Typography variant={"h6"}>
              <Box>
                +{pointsAwarded.points} {pointsAwarded.to}
              </Box>
            </Typography>
          </Box>
        </Fade>
        <CSSTransition
          in={skipUsed}
          timeout={500}
          classNames={{ ...fadeIn }}
          unmountOnExit
        >
          <Box mt={4} textAlign={"center"}>
            <Typography variant={"h5"}>
              {skipsLeftInGame ? (
                <Box>
                  Skip Used{" "}
                  <Box style={{ fontSize: "0.5em" }}>(answer not shown)</Box>
                </Box>
              ) : (
                "No More Skips"
              )}
            </Typography>
            {skipsLeftInGame ? (
              <Box mt={2}>
                <Typography>Skips Left: {skipsLeft}</Typography>
              </Box>
            ) : (
              <Box mt={2}>
                <Typography variant={"body2"}>
                  Answer with majority chosen (point to trickster on ties)
                </Typography>
              </Box>
            )}
          </Box>
        </CSSTransition>
      </Box>

      <CSSTransition
        in={
          answerChoice !== AnswerChoiceEnum.NoAnswer &&
          selectedAnswer === AnswerChoiceEnum.NoAnswer
        }
        timeout={500}
        classNames={{ ...fadeIn }}
        unmountOnExit={true}
      >
        <Box display={"flex"} justifyContent={"center"}>
          <CustomButton
            onClick={() => answerSelectClick()}
            className={classes.confirmButton}
            disableRipple={true}
          >
            Confirm
          </CustomButton>
        </Box>
      </CSSTransition>

      <CSSTransition
        in={
          animIn &&
          selectedAnswer !== AnswerChoiceEnum.NoAnswer &&
          numChosen.length > 0 &&
          playerChoices.length === 0
        }
        timeout={500}
        classNames={{ ...fadeIn }}
        unmountOnExit={true}
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
          style={{ transform: "translateX(-50%)", backgroundColor: "#fafafa" }}
          p={{ xs: 3, sm: 5 }}
          boxShadow={3}
          borderRadius={3}
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

      <CSSTransition
        in={playerChoices.length !== 0 && numReady.length === 0}
        timeout={500}
        classNames={{ ...fadeIn }}
        unmountOnExit={true}
      >
        <Box display={"flex"} justifyContent={"center"}>
          <CustomButton
            onClick={continueClick}
            className={clsx(classes.confirmButton)}
            style={{ width: "175px" }}
            disableRipple={true}
          >
            Next Round?
          </CustomButton>
        </Box>
      </CSSTransition>

      <CSSTransition
        in={animIn && numReady.length > 0}
        timeout={500}
        classNames={{ ...fadeIn }}
        unmountOnExit={true}
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
        >
          <LinearProgress
            variant="determinate"
            value={numReady.length > 0 ? (numReady[0] / numReady[1]) * 100 : 0}
            className={classes.voteProgressBar}
          />
          <Box mt={2}>
            {numReady.length > 0 && (
              <Typography variant={"h5"}>
                {numReady[0]} / {numReady[1]}
              </Typography>
            )}
          </Box>
        </Box>
      </CSSTransition>
    </Box>
  );
};

export default Question;
