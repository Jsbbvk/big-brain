const { getRoom } = require("./room");
const Handle = require("../util/handle");
const Status = require("../util/status");
const AnswerEnum = require("../enum/answer-enum");
const { getQuestion } = require("../config/questions");

const getCanCallVote = async (roomId) => {
  let res = await getRoom(roomId, true);
  if (res.status !== "success") return res;

  let {
    data: { room },
  } = res;

  return Status({ canCallVote: room.stats.canCallVote }, "success");
};

const setCanCallVote = async (roomId, canCallVote = null) => {
  let res = await getRoom(roomId);
  if (res.status !== "success") return res;

  let {
    data: { room },
  } = res;

  if (canCallVote !== null) {
    room.stats.canCallVote.allow = canCallVote;
    room.stats.canCallVote.numRounds = 0;
  } else {
    if (!room.stats.canCallVote.allow && room.stats.canCallVote.numRounds >= 1)
      room.stats.canCallVote.allow = false;
    room.stats.canCallVote.numRounds = room.stats.canCallVote.numRounds + 1;
  }

  let [, err] = await Handle(room.save());
  if (err) {
    console.log(err);
    return Status({}, "error");
  }

  return Status({}, "success");
};

const getSkipsLeft = async (roomId) => {
  let res = await getRoom(roomId, true);
  if (res.status !== "success") return res;

  let {
    data: { room },
  } = res;

  return Status({ skipsLeft: room.stats.skipsLeft }, "success");
};

const useSkip = async (roomId, skips) => {
  let res = await getRoom(roomId);
  if (res.status !== "success") return res;

  let {
    data: { room },
  } = res;
  const originSkips = room.stats.skipsLeft;

  if (originSkips === 0) {
    console.log("not enough skips");
    return Status({ skipsLeft: -1 }, "not_enough_skips");
  }

  room.stats.skipsLeft = Math.max(originSkips - skips, 0);

  let [, err] = await Handle(room.save());
  if (err) {
    console.log(err);
    return Status({}, "error");
  }

  return Status({ skipsLeft: Math.max(originSkips - skips, 0) }, "success");
};

const addPoint = async (roomId, to, points) => {
  let res = await getRoom(roomId);
  if (res.status !== "success") return res;

  let {
    data: { room },
  } = res;

  room.stats.points[to] = room.stats.points[to] + points;

  let [, err] = await Handle(room.save());
  if (err) {
    console.log(err);
    return Status({}, "error");
  }

  return Status({}, "success");
};

const getRoundQuestion = async (roomId, getAnswer = true) => {
  let res = await getRoom(roomId, true);
  if (res.status !== "success") return res;

  let {
    data: { room },
  } = res;

  return Status(
    {
      question: room.roundInfo.question,
      answers: {
        options: room.roundInfo.answers.options,
        correctEnum: getAnswer
          ? room.roundInfo.answers.correctEnum
          : AnswerEnum.NoAnswer,
      },
    },
    "success"
  );
};

const setRoundQuestion = async (roomId, difficulty) => {
  let res = await getRoom(roomId);
  if (res.status !== "success") return res;

  let {
    data: { room },
  } = res;

  let qObj = await getQuestion(difficulty);

  room.roundInfo.question = qObj.question;
  room.roundInfo.answers.options = qObj.answers;
  room.roundInfo.answers.correctEnum = qObj.correctIndex;

  let [, err] = await Handle(room.save());
  if (err) {
    console.log(err);
    return Status({}, "error");
  }

  return Status({}, "success");
};

const setRoundDuration = async (roomId, roundDuration) => {
  let res = await getRoom(roomId);
  if (res.status !== "success") return res;

  let {
    data: { room },
  } = res;

  room.roundInfo.timer.roundDurationInSeconds = roundDuration;
  let [, err] = await Handle(room.save());
  if (err) {
    console.log(err);
    return Status({}, "error");
  }
  return Status({}, "success");
};

const getRoundDuration = async (roomId) => {
  let res = await getRoom(roomId, true);
  if (res.status !== "success") return res;

  let {
    data: { room },
  } = res;

  return Status(
    { roundDuration: room.roundInfo.timer.roundDurationInSeconds },
    "success"
  );
};

const getRoundTimer = async (roomId) => {
  let res = await getRoom(roomId, true);
  if (res.status !== "success") return res;

  let {
    data: { room },
  } = res;

  return Status(
    {
      timer: {
        startTime: room.roundInfo.timer.roundStartTime,
        duration: room.roundInfo.timer.roundDurationInSeconds,
      },
    },
    "success"
  );
};

const setRoundTimer = async (roomId) => {
  let res = await getRoom(roomId);
  if (res.status !== "success") return res;

  let {
    data: { room },
  } = res;

  room.roundInfo.timer.roundStartTime = Date.now();

  let [, err] = await Handle(room.save());
  if (err) {
    console.log(err);
    return Status({}, "error");
  }

  return Status({}, "success");
};

const setVotedPlayer = async (roomId, votedPlayer) => {
  let res = await getRoom(roomId);
  if (res.status !== "success") return res;

  let {
    data: { room },
  } = res;

  room.stats.votedPlayer = votedPlayer;

  let [, err] = await Handle(room.save());
  if (err) {
    console.log(err);
    return Status({}, "error");
  }

  return Status({}, "success");
};

const getVotedPlayer = async (roomId) => {
  let res = await getRoom(roomId, true);
  if (res.status !== "success") return res;

  let {
    data: { room },
  } = res;

  return Status(
    {
      votedPlayer: room.stats.votedPlayer,
    },
    "success"
  );
};

module.exports = {
  getVotedPlayer,
  setVotedPlayer,
  setCanCallVote,
  getCanCallVote,
  setRoundTimer,
  setRoundQuestion,
  getRoundQuestion,
  getRoundTimer,
  addPoint,
  useSkip,
  getSkipsLeft,
  setRoundDuration,
  getRoundDuration,
};
