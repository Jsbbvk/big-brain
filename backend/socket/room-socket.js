const { createPlayer } = require("../storage/player");
const { getGameInSession } = require("../storage/gameplay");
const { createRoom, getPlayers, getRoomStats } = require("../storage/room");
const { socket_emit } = require("./main");
const Status = require("../util/status");

const init = (socket) => {
    socket.on("create room", create_and_join_room(socket));
    socket.on("join room", join_room(socket));
    socket.on("get players", get_players);
    socket.on("get room stats", get_room_stats);
};

//todo learn cachegoose

const get_room_stats = async (data, cb) => {
    let { room_id } = data;
    let res = await getRoomStats(room_id);
    cb && cb(res);
};

const get_players = async (data, cb) => {
    let { room_id } = data;
    let res = await getPlayers(room_id);
    cb && cb(res);
};

const create_and_join_room = (socket) => async (data, cb) => {
    let { roomId, username } = data;
    const res = await createRoom(roomId);
    if (res.status !== "success") {
        cb && cb(Status({}, res.status));
        return;
    }

    const playerRes = await createPlayer(username, roomId);
    if (playerRes.status !== "success") {
        cb && cb(Status({}, playerRes.status));
        return;
    }

    socket.join(roomId);
    cb && cb(Status({ uuid: playerRes.data.uuid }, "success"));
};

const join_room = (socket) => async (data, cb) => {
    let { roomId, username } = data;

    let resSession = await getGameInSession(roomId);

    if (resSession.status !== "success") {
        cb && cb(resSession);
        return;
    }

    if (resSession.data.gameInSession) {
        cb && cb(Status({}, "game_in_session"));
        return;
    }

    const res = await createPlayer(username, roomId);
    if (res.status !== "success") {
        cb && cb(Status({}, res.status));
        return;
    }
    socket.join(roomId);

    socket_emit(socket, roomId, "player join", Status({}, "success"));

    cb && cb(Status({ uuid: res.data.uuid }, "success"));
};

module.exports = init;
