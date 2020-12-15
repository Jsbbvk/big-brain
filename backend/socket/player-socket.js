const {
  getRoom,
  getPlayers,
  getPlayersStats,
  addModifier,
  getModifier,
  removeModifiers,
} = require("../storage/room");
const {
  numPlayersSelectedClass,
  numPlayersSelectedModifier,
  numPlayersSelectedAnswer,
  setPlayerStats,
  numPlayersFinishVoting,
  numPlayersContinueEndGame,
} = require("../storage/player-stats");
const {
  getPlayerAnswers,
  setPlayerAnswers,
  getCorrectAnswerEnum,
  setGameInSession,
} = require("../storage/gameplay");
const {
  setRoundTimer,
  setRoundQuestion,
  addPoint,
  useSkip,
  setVotedPlayer,
  setRoundDuration,
} = require("../storage/round-gameplay");
const { getPlayer } = require("../storage/player");
const { defaultRoundInfo } = require("../storage/models/room.model");

const Status = require("../util/status");
const { socket_emit, emit } = require("./main");
const AnswerEnum = require("../enum/answer-enum");
const ModifierEnum = require("../enum/modifier-enum");
const RoleEnum = require("../enum/role-enum");

const init = (socket) => {
  socket.on("select class", select_class(socket));
  socket.on("get player number", get_player_number);
  socket.on("select modifier", select_modifier(socket));
  socket.on("select answer", select_answer(socket));
  socket.on("get player role", get_player_role);
  socket.on("finish voting", player_finish_voting(socket));
  socket.on("continue to end game", continue_end_game(socket));
};

const continue_end_game = (socket) => async (data, cb) => {
  let { room_id, player_uuid } = data;
  const res = await setPlayerStats(player_uuid, { continueEndGame: true });
  if (res.status !== "success") {
    cb && cb(res);
    return;
  }

  const resEnd = await numPlayersContinueEndGame(room_id);
  if (resEnd.status !== "success") {
    cb && cb(resEnd);
    return;
  }

  socket_emit(
    socket,
    room_id,
    "player continue to end game",
    Status(
      {
        numReady: resEnd.data.numReady,
      },
      "success"
    )
  );

  cb && cb(Status({ numReady: resEnd.data.numReady }, "success"));

  if (resEnd.data.numReady[0] !== resEnd.data.numReady[1]) return;

  let { status: ses_status } = await setGameInSession(room_id, false);
  if (ses_status !== "success") return;

  emit(room_id, "game end");
};

const player_finish_voting = (socket) => async (data, cb) => {
  let { room_id, player_uuid } = data;
  const res = await setPlayerStats(player_uuid, { finishVoting: true });
  if (res.status !== "success") {
    cb && cb(res);
    return;
  }

  const resVotes = await numPlayersFinishVoting(room_id);
  if (resVotes.status !== "success") {
    cb && cb(resVotes);
    return;
  }

  socket_emit(
    socket,
    room_id,
    "player finish voting",
    Status(
      {
        numReady: resVotes.data.numReady,
      },
      "success"
    )
  );

  cb && cb(Status({ numReady: resVotes.data.numReady }, "success"));

  if (resVotes.data.numReady[0] !== resVotes.data.numReady[1]) return;

  //calculate if it is a majority vote
  let {
    data: { players },
    status: vote_status,
  } = await getPlayersStats(room_id, "votedPlayer");
  if (vote_status !== "success") return;

  let votedPlayers = {};
  players.forEach((p, i) => {
    if (p === "skip_voting") {
      votedPlayers.skip = votedPlayers.skip == null ? 1 : votedPlayers.skip + 1;
    } else {
      votedPlayers[p.toString()] =
        votedPlayers[p.toString()] == null ? 1 : votedPlayers[p.toString()] + 1;
    }
  });
  let maxFreq = 0;
  let max = [];
  for (let key in votedPlayers) {
    if (votedPlayers[key] > maxFreq) {
      max = [key];
      maxFreq = votedPlayers[key];
    } else if (votedPlayers[key] === maxFreq) {
      max.push(key);
    }
  }

  if (max.indexOf("skip") !== -1 || max.length >= 2) return;

  //voted for a player
  let { status: v_status } = await setVotedPlayer(room_id, max[0]);
  if (v_status !== "success") return;

  emit(room_id, "display results", Status({}, "success"));
};

const get_player_role = async (data, cb) => {
  let { player_uuid } = data;
  const res = await getPlayer(player_uuid);
  if (res.status !== "success") {
    cb && cb(res);
    return;
  }

  cb && cb(Status({ role: res.data.player.gameplay.role }, "success"));
};

const get_player_number = async (data, cb) => {
  let { player_uuid, room_id } = data;
  const res = await getRoom(room_id);
  if (res.status !== "success") {
    cb && cb(res);
    return;
  }
  let {
    data: { room },
  } = res;
  const idx = room.players.indexOf(player_uuid);
  cb && cb(Status({ idx }, "success"));
};

const select_class = (socket) => async (data, cb) => {
  let { room_id, player_uuid, classEnum } = data;

  const res = await setPlayerStats(player_uuid, { classEnum });
  if (res.status !== "success") {
    cb && cb(res);
    return;
  }
  const resClass = await numPlayersSelectedClass(room_id);
  if (resClass.status !== "success") {
    cb && cb(resClass);
    return;
  }

  socket_emit(
    socket,
    room_id,
    "player selected class",
    Status(
      {
        numReady: resClass.data.numReady,
      },
      "success"
    )
  );
  cb && cb(Status({ numReady: resClass.data.numReady }, "success"));
};

const select_modifier = (socket) => async (data, cb) => {
  let { room_id, player_uuid, modifierEnum } = data;

  const res = await setPlayerStats(player_uuid, { modifierEnum });
  if (res.status !== "success") {
    cb && cb(res);
    return;
  }

  const resM = await addModifier(room_id, player_uuid, modifierEnum);
  if (resM.status !== "success") {
    cb && cb(resM);
    return;
  }

  const resModifier = await numPlayersSelectedModifier(room_id);
  if (resModifier.status !== "success") {
    cb && cb(resModifier);
    return;
  }

  socket_emit(
    socket,
    room_id,
    "player selected modifier",
    Status(
      {
        numReady: resModifier.data.numReady,
      },
      "success"
    )
  );
  cb && cb(Status({ numReady: resModifier.data.numReady }, "success"));

  if (resModifier.data.numReady[0] === resModifier.data.numReady[1])
    await continue_to_question(room_id);
};

const continue_to_question = async (room_id) => {
  let resM = await getModifier(room_id, { all: true });
  if (resM.status !== "success") {
    console.log(resM.status);
    return;
  }
  let {
    data: { modifiers: og_modifiers },
  } = resM;
  //cancelling samaritan modifiers
  if (
    og_modifiers[0] === ModifierEnum["cancel_single_samaritan_modifier"] &&
    Math.random() <= 0.8
  ) {
    let resRm = await removeModifiers(room_id, { removeSingle: true });
    if (resRm.status !== "success") return;
  } else if (
    og_modifiers[0] === ModifierEnum["cancel_all_samaritan_modifiers"] &&
    Math.random() <= 0.6
  ) {
    let resRm = await removeModifiers(room_id, { removeSingle: false });
    if (resRm.status !== "success") return;
  }

  //cancelling trickster modifier
  if (
    og_modifiers.includes(ModifierEnum["cancel_trickster_modifier"]) &&
    Math.random() <= 0.5
  ) {
    let resRm = await removeModifiers(room_id, { removeTrickster: true });
    if (resRm.status !== "success") return;
  }

  let resAllM = await getModifier(room_id, { all: true });
  if (resAllM.status !== "success") return resAllM;
  let {
    data: { modifiers },
  } = resAllM;

  //setting question difficulty
  let difficulty = "medium";
  if (modifiers.includes(ModifierEnum["question_difficulty_easy"]))
    difficulty = "easy";
  if (modifiers.includes(ModifierEnum["question_difficulty_hard"]))
    difficulty = "hard";

  let { status: question_status } = await setRoundQuestion(room_id, difficulty);
  if (question_status !== "success") return;

  //setting round timer
  let timer = defaultRoundInfo.timer.roundDurationInSeconds;
  if (modifiers.includes(ModifierEnum["increase_round_duration"])) timer = 75;
  if (modifiers.includes(ModifierEnum["decrease_round_duration"])) timer = 15;

  let resTimer = await setRoundDuration(room_id, timer);
  if (resTimer.status !== "success") return;

  emit(room_id, "finish question setup");
};

const select_answer = (socket) => async (data, cb) => {
  let { room_id, player_uuid, answerEnum } = data;

  const res = await setPlayerStats(player_uuid, { answerEnum });
  if (res.status !== "success") {
    cb && cb(res);
    return;
  }

  const resModifier = await numPlayersSelectedAnswer(room_id);
  if (resModifier.status !== "success") {
    cb && cb(res);
    return;
  }

  socket_emit(
    socket,
    room_id,
    "player selected answer",
    Status(
      {
        numReady: resModifier.data.numReady,
      },
      "success"
    )
  );
  cb && cb(Status({ numReady: resModifier.data.numReady }, "success"));

  if (resModifier.data.numReady[0] === resModifier.data.numReady[1]) {
    await calculateRoundScore(room_id);
  }
};

const calculateRoundScore = async (roomId) => {
  //[ [players who chose 1] [players who chose 2] ]
  //returns player's uuid
  //let { status: pa_status, data: {answers: og_answers} } = await getPlayerAnswers(roomId);
  //if (pa_status !== "success") return;

  //getting correct answer
  let resAnswerEnum = await getCorrectAnswerEnum(roomId);
  if (resAnswerEnum.status !== "success") return;
  let {
    data: { answerEnum },
  } = resAnswerEnum;

  //checking if trickster made samaritan choose wrong answer
  let resAllM = await getModifier(roomId, { all: true });
  if (resAllM.status !== "success") return;
  let {
    data: { modifiers },
  } = resAllM;

  if (modifiers.includes(ModifierEnum["samaritan_choose_wrong_answer"])) {
    let resPuuid = await getModifier(roomId, { random_puuid: true });
    if (resPuuid.status !== "success") return;
    let {
      data: {
        modifier: { player_uuid },
      },
    } = resPuuid;

    const wrongAnswer =
      answerEnum === AnswerEnum.Answer1
        ? AnswerEnum.Answer2
        : AnswerEnum.Answer1;
    const resMP = await setPlayerStats(player_uuid, {
      answerEnum: wrongAnswer,
    });
    if (resMP.status !== "success") return;
  }

  // [ [uuid1, uuid2], [uuid3] ]
  //await setPlayerAnswers(roomId, og_answers);

  //get updated player answers (after modifiers)
  let res = await getPlayerAnswers(roomId);
  let {
    data: { answers },
  } = res;

  //calculate answer
  let returnObj = { answers };

  if (!answers[0].length || !answers[1].length) {
    //unanimous vote

    //checking if trickster blinded answers
    if (!modifiers.includes(ModifierEnum["blind_answers"]))
      returnObj.answerEnum = answerEnum;

    //setting points
    let samaritan_points = 1;
    let trickster_points = 1;

    if (modifiers.includes(ModifierEnum["double_samaritan_points"]))
      samaritan_points = 2;
    if (modifiers.includes(ModifierEnum["trickster_no_points"]))
      trickster_points = 0;

    if (modifiers.includes(ModifierEnum["double_trickster_point"]))
      trickster_points = 2;
    if (modifiers.includes(ModifierEnum["samaritan_no_points"]))
      samaritan_points = 0;

    if (answers[answerEnum].length) {
      //correct answer
      let { status: point_status } = await addPoint(
        roomId,
        "samaritan",
        samaritan_points
      );
      if (point_status !== "success") return;
      returnObj.pointsAwarded = {
        points: samaritan_points,
        to: "Samaritan",
      };
    } else {
      //incorrect answer
      let { status: point_status } = await addPoint(
        roomId,
        "trickster",
        trickster_points
      );
      if (point_status !== "success") return;
      returnObj.pointsAwarded = {
        points: trickster_points,
        to: "Trickster",
      };
    }
  } else {
    //use skip

    //checking if trickster blinded answers
    if (
      !modifiers.includes(ModifierEnum["blind_answers"]) &&
      modifiers.includes(ModifierEnum["see_answers"])
    )
      returnObj.answerEnum = answerEnum;

    //modifying skips
    let skips = 1;
    if (modifiers.includes(ModifierEnum["skip_deduction_zero"])) skips = 0;
    if (modifiers.includes(ModifierEnum["skip_deduction_increase"])) skips = 2;

    let {
      status: skip_status,
      data: { skipsLeft },
    } = await useSkip(roomId, skips);

    if (skips !== 0 && skip_status === "not_enough_skips") {
      //not enough skips so select majority
      const firstLength = answers[0].length;
      const secondLength = answers[1].length;

      let samaritan_points = 1;
      let trickster_points = 1;

      if (modifiers.includes(ModifierEnum["double_samaritan_points"]))
        samaritan_points = 2;
      if (modifiers.includes(ModifierEnum["trickster_no_points"]))
        trickster_points = 0;

      if (modifiers.includes(ModifierEnum["double_trickster_point"]))
        trickster_points = 2;
      if (modifiers.includes(ModifierEnum["samaritan_no_points"]))
        samaritan_points = 0;

      if (
        (firstLength > secondLength && answerEnum === AnswerEnum.Answer1) ||
        (secondLength > firstLength && answerEnum === AnswerEnum.Answer2)
      ) {
        let { status: point_status } = await addPoint(
          roomId,
          "samaritan",
          samaritan_points
        );
        if (point_status !== "success") return;
        returnObj.pointsAwarded = {
          points: samaritan_points,
          to: "Samaritan",
        };
      } else {
        //if tie, trickster wins
        //so also return the right answer

        //checking if trickster blinded answers
        if (!modifiers.includes(ModifierEnum["blind_answers"]))
          returnObj.answerEnum = answerEnum;

        let { status: point_status } = await addPoint(
          roomId,
          "trickster",
          trickster_points
        );
        if (point_status !== "success") return;
        returnObj.pointsAwarded = {
          points: trickster_points,
          to: "Trickster",
        };
      }
    } else if (skip_status !== "success") return;

    returnObj.skipsLeft = skipsLeft;
  }

  emit(
    roomId,
    "calculated player answers",
    Status({ ...returnObj }, "success")
  );
};

module.exports = init;
