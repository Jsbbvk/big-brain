import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CustomModal from "../../../CustomComponents/CustomModal";
import { Typography, Box, TextField } from "@material-ui/core";
import clsx from "clsx";
import CustomButton from "../../../CustomComponents/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { emission } from "../../../Socket/main";
import { set_player } from "../../../../redux/actions";

const useStyles = makeStyles({
    button: {
        padding: "10px 15px",
        width: "150px",
        boxShadow: "none",
        backgroundColor: "#ebebeb",
        "&:hover": {
            backgroundColor: "#ebebeb",
        },
    },
});

export default function PlayerSettings(props) {
    const classes = useStyles();
    const newName = useRef(null);

    const roomId = useSelector((state) => state.roomId);
    const player = useSelector((state) => state.player);
    const dispatch = useDispatch();

    const setNewName = async () => {
        let name = newName.current.value;
        if (name.length < 1) return;
        let res = await emission("set player name", {
            player_uuid: player.uuid,
            name,
            room_id: roomId,
        });
        if (res.status !== "success") return;

        dispatch(set_player({ name }));
        props.toggleDisplay(false);
    };

    return (
        <CustomModal {...props}>
            <Box textAlign={"center"} mt={10}>
                <Typography variant={"h5"}>Change Name</Typography>
                <Box mt={2}>
                    <TextField
                        inputRef={newName}
                        label="New Name"
                        variant="outlined"
                        inputProps={{
                            maxLength: 20,
                        }}
                        styles={{ width: 300 }}
                    />
                </Box>
                <Box mt={3}>
                    <CustomButton
                        disableRipple
                        className={classes.button}
                        onClick={setNewName}
                    >
                        Set New Name
                    </CustomButton>
                </Box>
            </Box>
        </CustomModal>
    );
}
