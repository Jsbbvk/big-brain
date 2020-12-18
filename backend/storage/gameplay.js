const { Player, defaultPlayerStats } = require("./models/player.model");
const {
    Room,
    defaultRoomStats,
    defaultRoundInfo,
} = require("./models/room.model");
const { getRoom, getPlayers } = require("./room");
const { setPlayerGameplay, getPlayer } = require("./player");

const Handle = require("../util/handle");
const Status = require("../util/status");

const RoleEnum = require("../enum/role-enum");
const AnswerEnum = require("../enum/answer-enum");

const setPlayerAnswers = async (roomId, playerAnswers) => {
    let res = await getRoom(roomId, true);
    if (res.status !== "success") return res;

    let {
        data: {
            room: { players },
        },
    } = res;

    playerAnswers[0] = playerAnswers[0].map((p) => ({
        ...p,
        uuid: p.uuid.toString(),
    }));
    playerAnswers[1] = playerAnswers[1].map((p) => ({
        ...p,
        uuid: p.uuid.toString(),
    }));

    await Promise.all(
        players.map(async (p_uuid) => {
            let { status, data } = await getPlayer(p_uuid);
            if (status !== "success") {
                console.log(status);
                return;
            }
            let { player } = data;

            const indexOfUuid = (p) => p.uuid === p_uuid.toString();

            let answerChoice =
                playerAnswers[0].findIndex(indexOfUuid) !== -1
                    ? AnswerEnum.Answer1
                    : AnswerEnum.Answer2;

            player.stats.answerEnum = answerChoice;

            let [, errSave] = await Handle(player.save());
            if (errSave) {
                console.log(errSave);
                return;
            }
        })
    );

    return Status({}, "success");
};

const getPlayerAnswers = async (roomId) => {
    let res = await getPlayers(roomId);
    if (res.status !== "success") return res;
    let {
        data: { players },
    } = res;

    let answers = [[], []];

    players.forEach((p, i) =>
        answers[p.stats.answerEnum].push({ uuid: p._id, index: i })
    );

    return Status({ answers }, "success");
};

const getCorrectAnswerEnum = async (roomId) => {
    let res = await getRoom(roomId, true);
    if (res.status !== "success") return res;

    let {
        data: { room },
    } = res;

    return Status(
        { answerEnum: room.roundInfo.answers.correctEnum },
        "success"
    );
};

const setPlayerRoles = async (roomId) => {
    let res = await getRoom(roomId);
    if (res.status !== "success") return res;

    let {
        data: {
            room: { players },
        },
    } = res;

    const tricksterIdx = (Math.random() * players.length) | 0;

    await Promise.all(
        players.map(async (p, i) => {
            await setPlayerGameplay(players[i], {
                role:
                    tricksterIdx === parseInt(i)
                        ? RoleEnum.Trickster
                        : RoleEnum.Samaritan,
            });
        })
    );

    return Status({}, "success");
};

const getGameInSession = async (roomId) => {
    let res = await getRoom(roomId, true);
    if (res.status !== "success") return res;

    let {
        data: { room },
    } = res;

    return Status({ gameInSession: room.gameplay.gameInSession }, "success");
};

const setGameInSession = async (roomId, inSession) => {
    let res = await getRoom(roomId);
    if (res.status !== "success") return res;
    let {
        data: { room },
    } = res;

    if (inSession && room.players.length < 3) {
        console.log("not enough players");
        return Status({}, "not_enough_players");
    }

    room.gameplay.gameInSession = inSession;
    let [, errSave] = await Handle(room.save());
    if (errSave) {
        console.log(errSave);
        return Status({}, "error");
    }

    return Status({}, "success");
};

const resetRoom = async (roomId) => {
    let [, err] = await Handle(
        Room.findOneAndUpdate(
            { roomId },
            {
                $set: {
                    stats: defaultRoomStats,
                },
            }
        )
    );

    if (err) {
        console.log(err);
        return Status({}, "error");
    }

    return Status({}, "success");
};

const resetRound = async (roomId) => {
    let [, err] = await Handle(
        Room.findOneAndUpdate(
            { roomId },
            {
                $set: {
                    roundInfo: defaultRoundInfo,
                },
            }
        )
    );

    if (err) {
        console.log(err);
        return Status({}, "error");
    }

    return Status({}, "success");
};

const resetPlayers = async (roomId) => {
    let [room, errFind] = await Handle(
        Room.findOne({ roomId }).select("players").lean()
    );
    if (errFind) {
        console.log(errFind);
        return Status({}, "error");
    }

    if (!room) {
        console.log("room not found");
        return Status({}, "room_not_found");
    }

    let [, errUpdate] = await Handle(
        Player.updateMany(
            { _id: { $in: room.players } },
            {
                $set: {
                    stats: defaultPlayerStats,
                },
            }
        )
    );

    if (errUpdate) {
        console.log(errUpdate);
        return Status({}, "error");
    }

    return Status({}, "success");
};

module.exports = {
    resetPlayers,
    resetRoom,
    resetRound,
    setPlayerRoles,
    getGameInSession,
    setGameInSession,
    getPlayerAnswers,
    setPlayerAnswers,
    getCorrectAnswerEnum,
};
