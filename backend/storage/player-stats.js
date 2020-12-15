const { Room } = require("./models/room.model");
const { Player } = require("./models/player.model");
const handle = require("../util/handle");
const { getPlayers } = require("./room");
const ClassEnum = require("../enum/class-enum");
const ModifierEnum = require("../enum/modifier-enum");
const AnswerEnum = require("../enum/answer-enum");

const Status = require("../util/status");

const setPlayerStats = async (player_uuid, stats) => {
  let [player, errFind] = await handle(Player.findById(player_uuid));
  if (errFind) {
    console.log(errFind);
    return Status({}, "error");
  }

  if (!player) {
    console.log("cannot find player");
    return Status({}, "player_not_found");
  }

  player.stats = {
    ...player.stats,
    ...stats,
  };

  let [, errSave] = await handle(player.save());

  if (errSave) {
    console.log(errSave);
    return Status({}, "error");
  }

  return Status({}, "success");
};

const numPlayersContinueNextRound = async (roomId) => {
  let res = await getPlayers(roomId);
  if (res.status !== "success") {
    return Status({}, res.status);
  }

  let {
    data: { players },
  } = res;

  let numContinue = players.reduce(
    (accum, curr) => (curr.stats.continueNextRound ? ++accum : accum),
    0
  );
  return Status({ numReady: [numContinue, players.length] }, "success");
};

const numPlayersSelectedAnswer = async (roomId) => {
  let res = await getPlayers(roomId);

  if (res.status !== "success") {
    return Status({}, res.status);
  }

  let {
    data: { players },
  } = res;

  let numSelectedClass = players.reduce(
    (accum, curr) =>
      curr.stats.answerEnum !== AnswerEnum.NoAnswer ? ++accum : accum,
    0
  );
  return Status({ numReady: [numSelectedClass, players.length] }, "success");
};

const numPlayersSelectedClass = async (roomId) => {
  let res = await getPlayers(roomId);

  if (res.status !== "success") {
    return Status({}, res.status);
  }

  let {
    data: { players },
  } = res;
  let numSelectedClass = players.reduce(
    (accum, curr) =>
      curr.stats.classEnum !== ClassEnum.NoClass ? ++accum : accum,
    0
  );
  return Status({ numReady: [numSelectedClass, players.length] }, "success");
};

const numPlayersSelectedModifier = async (roomId) => {
  let res = await getPlayers(roomId);

  if (res.status !== "success") {
    return Status({}, res.status);
  }

  let {
    data: { players },
  } = res;
  let numSelectedClass = players.reduce(
    (accum, curr) => (curr.stats.modifierEnum !== -1 ? ++accum : accum),
    0
  );
  return Status({ numReady: [numSelectedClass, players.length] }, "success");
};

const numPlayersVoted = async (roomId) => {
  let res = await getPlayers(roomId);

  if (res.status !== "success") {
    return Status({}, res.status);
  }

  let {
    data: { players },
  } = res;

  let numVoted = players.reduce(
    (accum, curr) => (curr.stats.votedPlayer !== null ? ++accum : accum),
    0
  );
  return Status({ numReady: [numVoted, players.length] }, "success");
};

const numPlayersFinishVoting = async (roomId) => {
  let res = await getPlayers(roomId);

  if (res.status !== "success") {
    return Status({}, res.status);
  }

  let {
    data: { players },
  } = res;

  let numVoted = players.reduce(
    (accum, curr) => (curr.stats.finishVoting ? ++accum : accum),
    0
  );
  return Status({ numReady: [numVoted, players.length] }, "success");
};

const numPlayersContinueEndGame = async (roomId) => {
  let res = await getPlayers(roomId);

  if (res.status !== "success") {
    return Status({}, res.status);
  }

  let {
    data: { players },
  } = res;

  let numEnd = players.reduce(
    (accum, curr) => (curr.stats.continueEndGame ? ++accum : accum),
    0
  );
  return Status({ numReady: [numEnd, players.length] }, "success");
};

module.exports = {
  numPlayersContinueEndGame,
  numPlayersFinishVoting,
  numPlayersVoted,
  numPlayersSelectedClass,
  numPlayersSelectedModifier,
  numPlayersSelectedAnswer,
  setPlayerStats,
  numPlayersContinueNextRound,
};
