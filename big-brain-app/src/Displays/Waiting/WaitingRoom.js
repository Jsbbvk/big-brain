import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import { create_and_join_room, join_room } from "../../Socket/rooms";
import {
  set_player,
  set_player_stats,
  set_room_id,
} from "../../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import Displays from "../Enums/DisplayEnum";
import { drop_collections, start_game } from "../../Socket/gameplay";
import { create_listener, remove_listener } from "../../Socket/listener";
import { get_player_number, get_player_role } from "../../Socket/player";

const WaitingRoom = (props) => {
  const player = useSelector((state) => state.player);
  const roomId = useSelector((state) => state.roomId);
  const dispatch = useDispatch();

  const [gameStart, setGameStart] = useState(false);

  const createRoom = () => {
    create_and_join_room("1111", "john doe").then((res) => {
      if (res.status !== "success") {
        console.log(res.status);
        return;
      }
      dispatch(set_player({ uuid: res.data.uuid, name: "john doe" }));
      dispatch(set_room_id("1111"));
      console.log("Player", res.data.uuid);
    });
  };

  const joinRoom = () => {
    join_room("1111", "joshua fisher").then((res) => {
      if (res.status !== "success") {
        console.log(res.status);
        return;
      }

      dispatch(set_player({ uuid: res.data.uuid, name: "joshua fisher" }));
      dispatch(set_room_id("1111"));
      console.log("Player", res.data.uuid);
    });
  };

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
      //todo
    });

    return () => {
      remove_listener("game start");
      remove_listener("player left");
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

  return (
    <React.Fragment>
      <Button variant={"contained"} color={"primary"} onClick={createRoom}>
        create and join room
      </Button>
      <Button variant={"contained"} color={"primary"} onClick={joinRoom}>
        join room
      </Button>
      <Button variant={"contained"} color={"primary"} onClick={start}>
        Start Game
      </Button>
      <Button variant={"contained"} color={"primary"} onClick={dropCollections}>
        Drop collections
      </Button>
    </React.Fragment>
  );
};

export default WaitingRoom;
