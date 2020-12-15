import React, { useState, useEffect } from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

const Timer = (props) => {
  const [seconds, setSeconds] = useState(0);

  const padTime = (time) => {
    return String(time).length === 1 ? `0${time}` : `${time}`;
  };

  const format = (time) => {
    if (seconds <= 0) return "0:00";
    // Convert seconds into minutes and take the whole part
    const mins = Math.floor(time / 60);

    // Get the seconds left after converting minutes
    const secs = time % 60;

    //Return combined values as string in format mm:ss
    return `${mins}:${padTime(secs)}`;
  };

  useEffect(() => {
    setSeconds(props.duration);
  }, [props.duration]);

  useEffect(() => {
    let timer;
    if (props.pause) return;

    timer = setTimeout(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => {
      timer && clearTimeout(timer);
    };
  }, [props.pause]);

  useEffect(() => {
    if (props.stop || props.pause) {
      return;
    }

    if (seconds < 0) {
      props.timeUp();
      return;
    }

    let timer = setTimeout(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => timer && clearTimeout(timer);
  }, [seconds]);

  return (
    <Box textAlign={"center"}>
      <Typography variant={"h1"}>{format(seconds)}</Typography>
    </Box>
  );
};

export default Timer;
