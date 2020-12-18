import React, { useRef, useState, useCallback } from "react";
import {
    Box,
    TextField,
    Typography,
    makeStyles,
    Grid,
    FormControl,
} from "@material-ui/core";
import CustomButton from "../../../CustomComponents/CustomButton";
import clsx from "clsx";
import {
    set_player,
    set_player_stats,
    set_room_id,
} from "../../../../redux/actions";
import { create_and_join_room } from "../../../Socket/rooms";
import { useDispatch } from "react-redux";
import Displays from "../../Enums/DisplayEnum";

const useStyles = makeStyles((theme) => ({
    uppercase: {
        textTransform: "uppercase",
    },
    button: {
        padding: "10px 15px",
        width: "150px",
        boxShadow: "none",
    },
    confirmButton: {
        backgroundColor: "#a5ffc1",
        "&:hover": {
            backgroundColor: "#a5ffc1",
        },
    },
    backButton: {
        backgroundColor: "#ebebeb",
        "&:hover": {
            backgroundColor: "#ebebeb",
        },
    },
    input: {
        width: "300px",
    },
}));

const Display = {
    None: 0,
    Create: 1,
    Join: 2,
};

const CreateRoom = (props) => {
    const classes = useStyles();

    const roomId = useRef(null);
    const name = useRef(null);

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const dispatch = useDispatch();

    const createRoom = useCallback(() => {
        const roomVal = roomId.current.value.toUpperCase(),
            nameVal = name.current.value;

        if (roomVal.length !== 5) {
            setError(true);
            setErrorMessage("Room Id must be 5 characters");
            return;
        }
        if (nameVal.length < 1) return;

        setError(false);
        create_and_join_room(roomVal, nameVal).then((res) => {
            if (res.status !== "success") {
                setError(true);
                setErrorMessage("Room taken");
                return;
            }

            dispatch(set_player({ uuid: res.data.uuid, name: nameVal }));
            dispatch(set_room_id(roomVal));
            // console.log("Player", res.data.uuid);
            props.switchDisplay(Displays.Waiting);
        });
    }, [roomId, name]);

    const onCreate = () => createRoom();

    return (
        <Box mt={6} textAlign={"center"}>
            <Typography variant={"h6"}>Create Room</Typography>
            <FormControl>
                <Box my={2}>
                    <TextField
                        error={error}
                        inputRef={roomId}
                        label="Room Id"
                        variant="outlined"
                        inputProps={{
                            maxLength: 5,
                            className: classes.uppercase,
                        }}
                        className={classes.input}
                        helperText={error && errorMessage}
                    />
                </Box>
                <Box mb={4}>
                    <TextField
                        inputRef={name}
                        label="Name"
                        variant="outlined"
                        inputProps={{ maxLength: 20 }}
                        className={classes.input}
                    />
                </Box>
                <Box>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <CustomButton
                                disableRipple
                                className={clsx(
                                    classes.button,
                                    classes.backButton
                                )}
                                onClick={() => props.setDisplay(Display.None)}
                            >
                                Back
                            </CustomButton>
                        </Grid>
                        <Grid item xs={6}>
                            <CustomButton
                                disableRipple
                                className={clsx(
                                    classes.button,
                                    classes.confirmButton
                                )}
                                onClick={onCreate}
                            >
                                <Box
                                    display={"flex"}
                                    textAlign={"center"}
                                    alignItems={"center"}
                                >
                                    <Box component={"span"} mr={1}>
                                        Create
                                    </Box>
                                    <img
                                        src={"/big-brain.png"}
                                        width={"16px"}
                                        height={"21px"}
                                    />
                                </Box>
                            </CustomButton>
                        </Grid>
                    </Grid>
                </Box>
            </FormControl>
        </Box>
    );
};

export default CreateRoom;
