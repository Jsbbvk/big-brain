import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";

const transitionStyles = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
};

const CustomTransition = (props) => {
  const [inProp, setInProp] = useState(false);

  return (
    <CSSTransition in={inProp} timeout={500}>
      {props.children}
    </CSSTransition>
  );
};

export default CustomTransition;
