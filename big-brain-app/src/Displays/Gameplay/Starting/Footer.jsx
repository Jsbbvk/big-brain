import React from "react";
import { Box, makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    bottom: {
        position: "absolute",
        left: "50%",
        bottom: "15px",
        transform: "translateX(-50%)",
        width: "90vw",
    },
}));

const Footer = React.memo((props) => {
    const classes = useStyles();
    return (
        <Box className={classes.bottom} textAlign={"center"}>
            <Box mb={1}>
                <img
                    src={"/github.svg"}
                    height={"24px"}
                    width={"24px"}
                    title={"Github Repo"}
                    style={{ cursor: "pointer", marginRight: "25px" }}
                    onClick={() =>
                        window.open(
                            "https://github.com/Jsbbvk/big-brain",
                            "_blank"
                        )
                    }
                />
                <img
                    src={"/popper.png"}
                    height={"24px"}
                    width={"24px"}
                    style={{ cursor: "pointer" }}
                    title={"Party Games"}
                    onClick={() =>
                        window.open("https://partygames.cf", "_self")
                    }
                />
            </Box>
            <Typography variant={"subtitle2"}>
                Original Party Game by Jacob Zhang
            </Typography>
        </Box>
    );
});

export default Footer;
