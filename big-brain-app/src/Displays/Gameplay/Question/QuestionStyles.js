import { makeStyles } from "@material-ui/core/styles";
import AnswerChoiceEnum from "../../Enums/AnswerChoiceEnum";

const styles = makeStyles((theme) => ({
  overflowHidden: {
    overflow: "hidden",
  },
  noHover: {
    pointerEvents: "none",
  },
  paper: {
    backgroundColor: "#fafafa",
  },
  voteProgressBar: {
    width: "300px",
    height: "10px",
  },
  confirmButton: {
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
  activeConfirmButton: {
    backgroundColor: "#8fdfa8",
  },
  button: {
    padding: "25px 30px",
    width: "300px",
  },
  voteButton: {
    position: "fixed",
    left: "25px",
    top: "20px",
    zIndex: "2",
  },
  menuButton: {
    position: "fixed",
    right: "20px",
    top: "20px",
    zIndex: "2",
  },
  modifierButton: {
    position: "fixed",
    left: "100px",
    top: "20px",
    zIndex: "2",
  },
  textHighlight: {
    background:
      "linear-gradient(90deg, rgba(255,180,180,1) 0%, rgba(180,236,255,1) 100%)",
    padding: "0 3px",
  },
}));

const highlightShadow =
  "0px 0px 7px 4px #ffbe006b, 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)";
const hoverHighlightShadow =
  "0px 0px 7px 4px #ffbe006b, 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)";
const hoverDefaultShadow =
  "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)";
const defaultShadow =
  "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)";

export const buttonStyles = (colors) =>
  makeStyles((props) => ({
    button: {
      background: colors.tertiary,
      boxShadow: colors.correct ? highlightShadow : defaultShadow,
      "&:hover": {
        boxShadow: colors.correct ? hoverHighlightShadow : hoverDefaultShadow,
        background: colors.secondary,
      },
      "&:active": {
        boxShadow: colors.correct ? hoverHighlightShadow : hoverDefaultShadow,
      },
      transition: "background 300ms ease-in-out",
    },
    buttonActive: {
      background: colors.secondary,
      "&:hover": {
        background: colors.secondary,
      },
    },
    buttonSelect: {
      background: colors.primary + " !important",
      "&:hover": {
        background: colors.primary,
      },
    },
    noButtonHover: {
      transition: "background 300ms ease-in-out, box-shadow 300ms",
      "&:hover": {
        background: colors.tertiary,
        boxShadow: colors.correct ? highlightShadow : defaultShadow,
      },
      "&:active": {
        boxShadow: colors.correct ? highlightShadow : defaultShadow,
      },
    },
  }));

export default styles;
