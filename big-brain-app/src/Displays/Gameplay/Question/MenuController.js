import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import Menu from "../Menu/Menu";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import clsx from "clsx";
import { useSelector } from "react-redux";
import RoleEnum from "../../Enums/RoleEnum";

const useStyles = makeStyles({
  topRight: {
    position: "fixed",
    right: "20px",
    top: "20px",
    zIndex: "2",
    backgroundColor: "#fafafa",
    "&:hover": {
      backgroundColor: "#f0f0f0",
    },
  },
  name: {
    maxWidth: "80px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  highlight: {
    background:
      "linear-gradient(90deg, rgba(255,180,180,1) 0%, rgba(180,236,255,1) 100%)",
  },
});

const MenuController = (props) => {
  const classes = useStyles();

  const [openMenu, setOpenMenu] = useState(false);

  const player = useSelector((state) => state.player);

  const toggleMenuDisplay = (state) => {
    setOpenMenu((prevMenu) => state || !prevMenu);
  };

  return (
    <React.Fragment>
      <Fab
        variant={"extended"}
        onClick={() => toggleMenuDisplay()}
        className={clsx(
          classes.topRight,
          player.stats.role === RoleEnum.Trickster && classes.highlight
        )}
        style={{ textTransform: "none" }}
        title={"Menu"}
        disableRipple
      >
        <Box className={classes.name}>{player.name}</Box>
        <Box ml={1} display={"flex"} alignItems={"center"}>
          <img
            src={`/icons/${player.stats.index}.svg`}
            width={32}
            height={32}
          />
        </Box>
      </Fab>
      <Menu toggleDisplay={toggleMenuDisplay} open={openMenu} />
    </React.Fragment>
  );
};

export default MenuController;
