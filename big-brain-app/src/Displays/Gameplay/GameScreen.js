import React from "react";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {},
});

const GameScreen = (props) => {
  const classes = useStyles();

  const children = React.Children.map(props.children, (child, i) =>
    React.cloneElement(child, { switchDisplay: props.switchDisplay })
  );

  return (
    <Container maxWidth={"md"}>
      <Box mt={12}>{children}</Box>
    </Container>
  );
};

export default GameScreen;
