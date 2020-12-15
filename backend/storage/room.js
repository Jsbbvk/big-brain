const { Room } = require("./models/room.model");
const { getPlayer } = require("./player");
const handle = require("../util/handle");
const Status = require("../util/status");
const ModifierEnum = require("../enum/modifier-enum");
const RoleEnum = require("../enum/role-enum");
//TODO cachegoose

const addModifier = async (roomId, playerId, modifier) => {
  let res = await getRoom(roomId);
  if (res.status !== "success") return res;
  let {
    data: { room },
  } = res;

  let resP = await getPlayer(playerId, true);
  if (resP.status !== "success") return resP;

  let {
    data: { player },
  } = resP;

  if (player.gameplay.role === RoleEnum.Trickster) {
    //trickster modifier
    room.roundInfo.modifiers.trickster = {
      enum: modifier,
      player_uuid: playerId,
    };
  } else {
    room.roundInfo.modifiers.samaritans.push({
      enum: modifier,
      player_uuid: playerId,
    });
  }

  let [, err] = await handle(room.save());
  if (err) {
    console.log(err);
    return Status({}, "error");
  }

  return Status({}, "success");
};

//todo set player.modifier.cancelled = true
const removeModifiers = async (roomId, options) => {
  let res = await getRoom(roomId);
  if (res.status !== "success") return res;
  let {
    data: { room },
  } = res;

  let { removeSingle, removeTrickster } = options;

  if (removeTrickster !== undefined) {
    room.roundInfo.modifiers.trickster.enum = ModifierEnum["NoModifier"];
  } else if (removeSingle !== undefined) {
    let mods = room.roundInfo.modifiers.samaritans;
    if (removeSingle) {
      let idx = (Math.random() * mods.length) | 0;
      room.roundInfo.modifiers.samaritans[idx].enum =
        ModifierEnum["NoModifier"];
    } else {
      mods.forEach((m, idx) => {
        room.roundInfo.modifiers.samaritans[idx].enum =
          ModifierEnum["NoModifier"];
      });
    }
  }

  let [, err] = await handle(room.save());
  if (err) {
    console.log(err);
    return Status({}, "error");
  }

  return Status({}, "success");
};

const getModifier = async (roomId, options) => {
  let res = await getRoom(roomId, true);
  if (res.status !== "success") return res;
  let {
    data: { room },
  } = res;
  let {
    roundInfo: { modifiers },
  } = room;

  let { getTrickster, player_uuid, all, random_puuid } = options;

  if (random_puuid !== undefined) {
    return Status(
      {
        modifier:
          modifiers.samaritans[
            (Math.random() * modifiers.samaritans.length) | 0
          ],
      },
      "success"
    );
  } else if (all !== undefined) {
    return Status(
      {
        modifiers: [
          modifiers.trickster.enum,
          ...modifiers.samaritans.map((m) => m.enum),
        ],
      },
      "success"
    );
  } else if (getTrickster !== undefined) {
    return Status(
      {
        modifier: modifiers[getTrickster ? "trickster" : "samaritans"].enum,
      },
      "success"
    );
  } else if (player_uuid !== undefined) {
    if (modifiers.trickster.player_uuid.toString() === player_uuid.toString()) {
      return Status(
        {
          modifier: modifiers.trickster.enum,
        },
        "success"
      );
    } else {
      let sam_mods = modifiers.samaritans.map((s) => s.player_uuid.toString());
      const idx = sam_mods.indexOf(player_uuid.toString());
      if (idx !== -1) {
        return Status(
          {
            modifier: modifiers.samaritans[idx].enum,
          },
          "success"
        );
      } else {
        return Status({}, "player_not_found");
      }
    }
  }

  return Status({}, "error");
};

const getPlayersStats = async (roomId, stat) => {
  let res = await getPlayers(roomId);
  if (res.status !== "success") return res;

  let {
    data: { players },
  } = res;

  let playerStats = players.map((p) => p.stats[stat]);
  return Status({ players: playerStats }, "success");
};

const getRoomStats = async (roomId) => {
  let res = await getRoom(roomId, true);
  if (res.status !== "success") return res;

  let {
    data: { room },
  } = res;

  return Status({ stats: room.stats }, "success");
};

const getRoom = async (roomId, lean = false) => {
  let [room, errFind] = await handle(Room.findOne({ roomId }).lean(lean));
  if (errFind) {
    console.log(errFind);
    return Status({}, "error");
  }
  if (!room) {
    console.log("room not found");
    return Status({}, "room_not_found");
  }

  return Status({ room }, "success");
};

const getPlayers = async (roomId) => {
  let [room, errFind] = await handle(
    Room.findOne({ roomId }).select("players").populate("players").lean()
  );
  if (errFind) {
    console.log(errFind);
    return Status({}, "error");
  }

  if (!room) {
    console.log("room doesn't exist");
    return Status({}, "room_not_found");
  }

  return Status({ players: room.players }, "success");
};

const leaveRoom = async (roomId, playerId) => {
  let [, err] = await handle(
    Room.updateOne(
      { roomId },
      {
        $pull: { players: playerId },
      }
    )
  );

  if (err) {
    console.log(err);
    return Status({}, "error");
  }

  return Status({}, "success");
};

const createRoom = async (roomId) => {
  let [dupRoom, errFind] = await handle(Room.findOne({ roomId }).lean());
  if (errFind) return Status({}, "error");
  if (dupRoom) return Status({}, "duplicate_room");

  let [r, err] = await handle(Room.create({ roomId }));

  if (err) {
    console.log(err);
    if (err.code === 11000) {
      return Status({}, "duplicate_room");
    }
    return Status({}, "error");
  }

  return Status({}, "success");
};

const joinRoom = async (roomId, playeruuid) => {
  let [room, err] = await handle(Room.findOne({ roomId }));
  if (err) {
    console.log(err);
    return Status({}, "error");
  }

  if (!room) {
    console.log("room doesn't exist");
    return Status({}, "room_not_found");
  }

  if (room.players.length >= room.gameplay.playerLimit) {
    console.log("room full");
    return Status({}, "room_full");
  }

  room.players.push(playeruuid);
  let [, saveErr] = await handle(room.save());
  if (saveErr) {
    console.log(err);
    return Status({}, "error");
  }

  return Status({}, "success");
};

const dropCollection = async () => {
  let [res, err] = await handle(Room.collection.drop());
};

module.exports = {
  getModifier,
  removeModifiers,
  addModifier,
  createRoom,
  joinRoom,
  leaveRoom,
  dropCollection,
  getPlayers,
  getRoom,
  getRoomStats,
  getPlayersStats,
};
