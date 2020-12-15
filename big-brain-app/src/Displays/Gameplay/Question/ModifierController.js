import React, { useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import ActiveModifierDisplay from "./ActiveModifierDisplay/ActiveModifierDisplay";
import clsx from "clsx";
import { useSelector } from "react-redux";

const useStyles = makeStyles({
  fab: {
    zIndex: "2",
    backgroundColor: "#fafafa",
    "&:hover": {
      backgroundColor: "#f0f0f0",
    },
  },
});

const ModifierController = (props) => {
  const classes = useStyles();

  const [openModifier, setOpenModifier] = useState(false);

  const toggleModifierDisplay = (state) => {
    setOpenModifier((prevMenu) => state || !prevMenu);
  };

  return (
    <React.Fragment>
      <Fab
        onClick={() => toggleModifierDisplay()}
        className={clsx(props.classes, classes.fab)}
        title={"Active modifier"}
        disableRipple
      >
        <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
          <img src={"/lightning.svg"} width={32} height={32} />
        </Box>
      </Fab>
      <ActiveModifierDisplay
        toggleDisplay={toggleModifierDisplay}
        open={openModifier}
      />
    </React.Fragment>
  );
};

export default ModifierController;
