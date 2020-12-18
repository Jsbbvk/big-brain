import React, { useState, useEffect, useCallback } from "react";
import Button from "@material-ui/core/Button";
import { set_player_stats } from "../../../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import Displays from "../../Enums/DisplayEnum";
import { drop_collections, start_game } from "../../../Socket/gameplay";
import { create_listener, remove_listener } from "../../../Socket/listener";
import { get_player_number, get_player_role } from "../../../Socket/player";
import { leave_room } from "../../../Socket/rooms";
import Rules from "../Rules/Rules";
import {
    Typography,
    Box,
    makeStyles,
    List,
    ListItemSecondaryAction,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Grid,
    IconButton,
} from "@material-ui/core";
import CreateIcon from "@material-ui/icons/Create";
import RemoveIcon from "@material-ui/icons/Remove";
import { emission } from "../../../Socket/main";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import fadeStyles from "../../AnimationStyles/FadeIn.module.scss";
import CustomButton from "../../../CustomComponents/CustomButton";
import clsx from "clsx";
import PlayerSettings from "./PlayerSettings";

const useStyles = makeStyles((theme) => ({
    playerCard: {
        margin: "7px 0",
        backgroundColor: "#e5e5e5",
        borderRadius: 4,
        paddingTop: 10,
        paddingBottom: 10,
    },
    list: {
        width: 300,
        margin: "0 auto",
    },
    hover: {
        cursor: "pointer",
        "&:hover": {
            opacity: "0.6",
        },
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
    icon: {
        "&:hover": {
            backgroundColor: "#00000014",
        },
    },
}));

const WaitingRoom = (props) => {
    const classes = useStyles();
    const player = useSelector((state) => state.player);
    const roomId = useSelector((state) => state.roomId);
    const dispatch = useDispatch();

    const [gameStart, setGameStart] = useState(false);
    const [players, setPlayers] = useState([]);

    const getPlayers = useCallback(async () => {
        let res = await emission("get players", { room_id: roomId });
        if (res.status !== "success") return;
        setPlayers(res.data.players);
    }, [setPlayers, roomId]);

    useEffect(() => {
        if (!gameStart) return;

        (async () => {
            let { status: pn_status, data: pn_data } = await get_player_number(
                roomId,
                player.uuid
            );
            if (pn_status !== "success") {
                console.log(pn_status);
                return;
            }

            let { status: pl_status, data: pl_data } = await get_player_role(
                player.uuid
            );
            if (pl_status !== "success") {
                console.log(pl_status);
                return;
            }

            dispatch(
                set_player_stats({
                    index: pn_data.idx,
                    role: pl_data.role,
                    prevModifiers: [],
                })
            );

            props.switchDisplay(Displays.Class);
        })();
    }, [gameStart]);

    useEffect(() => {
        create_listener("game start", (res) => {
            setGameStart(true);
        });

        create_listener("player left", (res) => {
            let { status, data } = res;
            if (status !== "success") return;

            let { player_uuid } = data;
            if (player_uuid === player.uuid) {
                props.switchDisplay(Displays.Start);
                return;
            }

            getPlayers();
        });

        create_listener("player join", (res) => {
            if (res.status !== "success") return;
            getPlayers();
        });

        create_listener("player update name", (res) => {
            if (res.status !== "success") return;
            getPlayers();
        });

        getPlayers();

        return () => {
            remove_listener("game start");
            remove_listener("player left");
            remove_listener("player join");
            remove_listener("player update name");
        };
    }, []);

    const start = async () => {
        let { status } = await start_game(roomId);
        //TODO handle errors
        if (status !== "success") {
            console.log(status);
        }
    };

    const dropCollections = () => {
        drop_collections();
    };

    const leave = async (uuid) => {
        leave_room(roomId, uuid);
    };

    const addPlayer = () => {
        setPlayers([...players, players[0]]);
    };

    const [open, setOpen] = useState(false);
    const toggleDisplay = (state) => {
        setOpen((prev) => state || !prev);
    };

    return (
        <>
            <Rules />
            <PlayerSettings open={open} toggleDisplay={toggleDisplay} />
            <Box>
                <Box textAlign={"center"}>
                    <Typography variant={"h5"}>
                        Room:{" "}
                        <Box
                            component={"span"}
                            style={{ textTransform: "uppercase" }}
                        >
                            {roomId}
                        </Box>
                    </Typography>
                    <Box mt={2}>
                        <Typography variant={"h6"}>Players</Typography>
                    </Box>
                    <Box mt={1}>
                        <List className={classes.list}>
                            <TransitionGroup>
                                {players.map((p, i) => (
                                    <CSSTransition
                                        key={i}
                                        timeout={500}
                                        classNames={{ ...fadeStyles }}
                                    >
                                        <ListItem
                                            className={classes.playerCard}
                                        >
                                            <ListItemAvatar>
                                                <img
                                                    src={`/icons/${i}.svg`}
                                                    width={20}
                                                    height={20}
                                                />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={`${p.username}${
                                                    p._id === player.uuid
                                                        ? " (You)"
                                                        : ""
                                                }`}
                                            />
                                            <ListItemSecondaryAction>
                                                {p._id === player.uuid ? (
                                                    <IconButton
                                                        edge="end"
                                                        title={"Edit Name"}
                                                        className={classes.icon}
                                                        onClick={() =>
                                                            toggleDisplay(true)
                                                        }
                                                    >
                                                        <CreateIcon />
                                                    </IconButton>
                                                ) : (
                                                    <IconButton
                                                        edge="end"
                                                        onClick={() =>
                                                            leave(p._id)
                                                        }
                                                        title={"Remove Player"}
                                                        className={classes.icon}
                                                    >
                                                        <RemoveIcon />
                                                    </IconButton>
                                                )}
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    </CSSTransition>
                                ))}
                            </TransitionGroup>
                        </List>
                    </Box>
                </Box>
            </Box>
            <Box mt={2} mx={"auto"} style={{ width: "300px" }}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Box display={"flex"} justifyContent={"center"}>
                            <CustomButton
                                disableRipple
                                className={clsx(
                                    classes.button,
                                    classes.backButton
                                )}
                                onClick={() => leave(player.uuid)}
                            >
                                Leave
                            </CustomButton>
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display={"flex"} justifyContent={"center"}>
                            <CustomButton
                                disableRipple
                                className={clsx(
                                    classes.button,
                                    classes.confirmButton
                                )}
                                onClick={start}
                            >
                                <Box
                                    display={"flex"}
                                    textAlign={"center"}
                                    alignItems={"center"}
                                >
                                    <Box component={"span"} mr={1}>
                                        Start
                                    </Box>
                                    <img
                                        src={"/big-brain.png"}
                                        width={"16px"}
                                        height={"21px"}
                                    />
                                </Box>
                            </CustomButton>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default WaitingRoom;
