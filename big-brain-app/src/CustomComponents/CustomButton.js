import React from "react";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Box from "@material-ui/core/Box";

const styles = {
  root: {
    textTransform: "none",
    padding: "10px 15px",
  },
};
const CustomButton = (props) => {
  const { classes, children, className, innerText, ...other } = props;

  return (
    <Button
      variant={"contained"}
      {...other}
      className={clsx(classes.root, props.className)}
    >
      <Box
        component={"span"}
        dangerouslySetInnerHTML={
          innerText && {
            __html: innerText,
          }
        }
      >
        {children}
      </Box>
    </Button>
  );
};

export default withStyles(styles)(CustomButton);
