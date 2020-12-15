import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import Box from "@material-ui/core/Box";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import CloseIcon from "@material-ui/icons/Close";
import Modal from "@material-ui/core/Modal";

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
}));

const CustomModal = (props) => {
  const classes = useStyles();
  const [openMenu, setOpenMenu] = useState(false);
  const toggleMenuDisplay = (state) => {
    setOpenMenu((prevMenu) => state || !prevMenu);
  };

  return (
    <Modal
      className={classes.modal}
      open={props.open}
      onClose={() => props.toggleDisplay(false)}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      {...props.disable}
    >
      <Fade in={props.open}>
        <Box className={classes.paper}>
          {!props.disableCloseButton && (
            <Fab
              title={"Close"}
              disableRipple
              className={classes.closeButton}
              onClick={() => props.toggleDisplay(false)}
              size={"small"}
            >
              <CloseIcon fontSize={"small"} />
            </Fab>
          )}
          {props.children}
        </Box>
      </Fade>
    </Modal>
  );
};

export default CustomModal;
