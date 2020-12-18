import React from "react";
import { Box, Grid, makeStyles, Typography } from "@material-ui/core";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
    button: {
        padding: "20px",
        borderRadius: "50%",
        width: "175px",
        height: "175px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
    },
    red: {
        backgroundColor: "#fc1e1e2b",
        transition: "background-color 250ms ease-in-out",
        "&:hover": {
            backgroundColor: "#fc1e1e6b",
        },
    },
    blue: {
        backgroundColor: "#a4d2f92b",
        transition: "background-color 250ms ease-in-out",
        "&:hover": {
            backgroundColor: "#a4d2f96b",
        },
    },
}));

const Display = {
    None: 0,
    Create: 1,
    Join: 2,
};

export default function Home(props) {
    const classes = useStyles();
    return (
        <Box mt={6}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Box display={"flex"} justifyContent={"center"}>
                        <Box
                            className={clsx(classes.button, classes.red)}
                            onClick={() => props.setDisplay(Display.Create)}
                        >
                            <Box>
                                <img
                                    src={"/big-brain.png"}
                                    width={"60px"}
                                    height={"90px"}
                                />
                            </Box>
                            <Typography variant={"h6"}>Create</Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box display={"flex"} justifyContent={"center"}>
                        <Box
                            className={clsx(classes.button, classes.blue)}
                            onClick={() => props.setDisplay(Display.Join)}
                        >
                            <Box>
                                <img
                                    src={"/small-brain.png"}
                                    width={"50px"}
                                    height={"60px"}
                                />
                            </Box>
                            <Typography variant={"h6"}>Join</Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}
