const { Player } = require("./models/player.model");
const { Room } = require("./models/room.model");
const handle = require("../util/handle");
const Status = require("../util/status");

const getPlayer = async (player_uuid, lean = false) => {
    let [player, errFind] = await handle(
        Player.findById(player_uuid).lean(lean)
    );
    if (errFind) {
        console.log(errFind);
        return Status({}, "error");
    }

    if (!player) {
        console.log("cannot find player");
        return Status({}, "player_not_found");
    }

    return Status({ player }, "success");
};

const setPlayerGameplay = async (player_uuid, gameplay) => {
    let [player, errFind] = await handle(Player.findById(player_uuid));
    if (errFind) {
        console.log(errFind);
        return Status({}, "error");
    }

    if (!player) {
        console.log("cannot find player");
        return Status({}, "player_not_found");
    }

    player.gameplay = {
        ...player.stats,
        ...gameplay,
    };

    let [, errSave] = await handle(player.save());

    if (errSave) {
        console.log(errSave);
        return Status({}, "error");
    }

    return Status({}, "success");
};

const createPlayer = async (username, roomId) => {
    let [room, roomErr] = await handle(Room.findOne({ roomId }));
    if (roomErr) {
        console.log(roomErr);
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

    let [p, err] = await handle(Player.create({ username, roomId }));
    if (err) {
        console.log(err);
        return Status({}, "error");
    }

    room.players.push(p._id);
    let [, saveErr] = await handle(room.save());
    if (saveErr) {
        console.log(err);
        return Status({}, "error");
    }

    return Status({ uuid: p._id }, "success");
};

const setPlayerName = async (uuid, name) => {
    let [, err] = await handle(
        Player.findOneAndUpdate({ _id: uuid }, { $set: { username: name } })
    );
    if (err) {
        console.log(err);
        return Status({}, "error");
    }
    return Status({}, "success");
};

const dropCollection = async () => {
    let [res, err] = await handle(Player.collection.drop());
};

module.exports = {
    setPlayerName,
    createPlayer,
    dropCollection,
    setPlayerGameplay,
    getPlayer,
};
