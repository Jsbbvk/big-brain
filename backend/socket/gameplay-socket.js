const Status = require("../util/status");
const {
  resetPlayers,
  resetRoom,
  setPlayerRoles,
  getGameInSession,
  setGameInSession,
  resetRound,
} = require("../storage/gameplay");
const {
  setPlayerStats,
  numPlayersContinueNextRound,
  numPlayersVoted,
} = require("../storage/player-stats");
const {
  getRoundQuestion,
  getRoundTimer,
  getSkipsLeft,
  getCanCallVote,
  setCanCallVote,
  setRoundDuration,
  getVotedPlayer,
} = require("../storage/round-gameplay");
const {
  getPlayersStats,
  getPlayers,
  getRoomStats,
  leaveRoom,
  getModifier,
} = require("../storage/room");
const { getPlayer } = require("../storage/player");
const shuffle = require("lodash/_arrayShuffle");
const RoleEnum = require("../enum/role-enum");
const ModifierEnum = require("../enum/modifier-enum");
const {
  defaultRoundInfo,
  pointsToWin,
} = require("../storage/models/room.model");
const { socket_emit, emit } = require("./main");

const init = (socket) => {
  socket.on("start game", startGame);
  socket.on("reset players", reset);
  socket.on("player continue to next round", continueNextRound(socket));
  socket.on("get round question", getQuestion);
  socket.on("get round timer", getTimer);
  socket.on("get skips left", getSkips);
  socket.on("end game", end_game);
  socket.on("leave game", leave_game);
  socket.on("get can call vote", get_can_call_vote);
  socket.on("call vote", call_vote);
  socket.on("vote player", vote_player(socket));
  socket.on("get results", get_results);
  socket.on("get modifier result", get_modifier_result);
};

const get_modifier_result = async (data, cb) => {
  let { room_id, player_uuid } = data;

  let resM = await getModifier(room_id, { player_uuid });
  if (resM.status !== "success") {
    cb && cb(resM);
    return;
  }

  let {
    data: { modifier },
  } = resM;
  if (modifier === ModifierEnum.NoModifier) {
    cb && cb(Status({ cancelled: true }, "success"));
    return;
  }

  if (modifier === ModifierEnum["see_samaritan_modifiers"]) {
    let resAll = await getModifier(room_id, { all: true });
    if (resAll.status !== "success") {
      cb && cb(resAll);
      return;
    }
    let {
      data: { modifiers },
    } = resAll;
    modifiers.splice(0, 1);
    cb && cb(Status({ modifiers: shuffle(modifiers) }, "success"));
    return;
  } else if (modifier === ModifierEnum["see_trickster_modifier"]) {
    let resT = await getModifier(room_id, { getTrickster: true });
    if (resT.status !== "success") {
      cb && cb(resT);
      return;
    }
    let {
      data: { modifier },
    } = resT;
    console.log(modifier);
    cb && cb(Status({ modifiers: [modifier] }, "success"));
    return;
  }

  cb && cb(Status({}, "success"));
};

const get_results = async (data, cb) => {
  let { room_id } = data;

  let resV = await getVotedPlayer(room_id);
  if (resV.status !== "success") {
    cb && cb(resV);
    return;
  }

  let {
    data: { votedPlayer },
  } = resV;

  let player = null;

  if (votedPlayer) {
    let resP = await getPlayer(votedPlayer, true);
    if (resP.status !== "success") {
      cb && cb(resP);
      return;
    }

    player = resP.data.player;
  }


  
  let resR = await getRoomStats(room_id);
  if (resR.status !== "success") {
    cb && cb(resR);
    return;
  }

  let {
    data: {
      stats: { points },
    },
  } = resR;

  let winner = null;
  if (points.samaritan === pointsToWin.samaritan) winner = RoleEnum.Samaritan;
  else if (points.samaritan === pointsToWin.trickster)
    winner = RoleEnum.Trickster;

  cb &&
    cb(
      Status(
        {
          votedPlayer: player,
          points,
          winner,
        },
        "success"
      )
    );
};

const vote_player = (socket) => async (data, cb) => {
  let { room_id, player_uuid, voted_player } = data;
  const res = await setPlayerStats(player_uuid, { votedPlayer: voted_player });
  if (res.status !== "success") {
    cb && cb(res);
    return;
  }

  const resVotes = await numPlayersVoted(room_id);
  if (resVotes.status !== "success") {
    cb && cb(resVotes);
    return;
  }

  socket_emit(
    socket,
    room_id,
    "player voted",
    Status(
      {
        numReady: resVotes.data.numReady,
      },
      "success"
    )
  );

  cb && cb(Status({ numReady: resVotes.data.numReady }, "success"));

  if (resVotes.data.numReady[0] !== resVotes.data.numReady[1]) return;

  let {
    data: { players },
    status,
  } = await getPlayersStats(room_id, "votedPlayer");
  if (status !== "success") return;

  let {
    data: { players: room_players },
    status: players_status,
  } = await getPlayers(room_id);
  if (players_status !== "success") return;

  let ids = room_players.map((p) => p._id.toString());

  let votedPlayers = new Array(players.length + 1);
  players.forEach((p, i) => {
    let idx = p === "skip_voting" ? players.length : ids.indexOf(p);
    if (!votedPlayers[idx]) votedPlayers[idx] = [];
    votedPlayers[idx].push(i);
  });

  emit(room_id, "all players voted", Status({ votedPlayers }, "success"));
};

const call_vote = async (data, cb) => {
  let { room_id } = data;
  let res = await setCanCallVote(room_id, false);
  if (res.status !== "success") return;

  emit(room_id, "called vote");
};

const get_can_call_vote = async (data, cb) => {
  let { room_id } = data;
  let res = await getCanCallVote(room_id);
  cb && cb(res);
};

const getSkips = async (data, cb) => {
  let { room_id } = data;
  let res = await getSkipsLeft(room_id);
  cb && cb(res);
};

const getTimer = async (data, cb) => {
  let { room_id } = data;
  let res = await getRoundTimer(room_id);
  cb && cb(res);
};

const getQuestion = async (data, cb) => {
  let { room_id } = data;

  let resM = await getModifier(room_id, { all: true });
  if (resM.status !== "success") return;
  let {
    data: { modifiers },
  } = resM;

  let res = await getRoundQuestion(
    room_id,
    !modifiers.includes(ModifierEnum["blind_trickster"])
  );
  cb && cb(res);
};

const continueNextRound = (socket) => async (data, cb) => {
  let { room_id, player_uuid } = data;
  const res = await setPlayerStats(player_uuid, { continueNextRound: true });
  if (res.status !== "success") {
    cb && cb(res);
    return;
  }

  const resContinue = await numPlayersContinueNextRound(room_id);
  if (resContinue.status !== "success") {
    cb && cb(res);
    return;
  }

  socket_emit(
    socket,
    room_id,
    "player continue to next round",
    Status(
      {
        numReady: resContinue.data.numReady,
      },
      "success"
    )
  );
  cb && cb(Status({ numReady: resContinue.data.numReady }, "success"));

  if (resContinue.data.numReady[0] !== resContinue.data.numReady[1]) return;
  //if players called a vote last round, allow them to call vote
  let resCallVote = await setCanCallVote(room_id);
  if (resCallVote.status !== "success") return;

  //reset round
  let resRound = await resetRound(room_id);
  if (resRound.status !== "success") return;

  //reset players
  let resPlayers = await resetPlayers(room_id);
  if (resPlayers.status !== "success") return;

  //check if samaritan or trickster won
  let resRoom = await getRoomStats(room_id);
  if (resRoom.status !== "success") return;
  let {
    data: {
      stats: { points },
    },
  } = resRoom;

  if (
    points.samaritan === pointsToWin.samaritan ||
    points.trickster === pointsToWin.trickster
  )
    emit(room_id, "display results", Status({}, "success"));
  else emit(room_id, "start next round");
};

const startGame = async (data, cb) => {
  let { room_id } = data;

  let resSession = await getGameInSession(room_id);

  if (resSession.status !== "success") {
    cb && cb(resSession);
    return;
  }

  if (resSession.data.gameInSession) {
    cb && cb(Status({}, "game_in_session"));
    return;
  }

  let resRoom = await resetRoom(room_id);
  if (resRoom.status !== "success") {
    cb && cb(resRoom);
    return;
  }

  let resRound = await resetRound(room_id);
  if (resRound.status !== "success") {
    cb && cb(resRound);
    return;
  }

  let resRoles = await setPlayerRoles(room_id);
  if (resRoles.status !== "success") {
    cb && cb(resRoles);
    return;
  }

  let resPlayers = await resetPlayers(room_id);
  if (resPlayers.status !== "success") {
    cb && cb(resPlayers);
    return;
  }

  let resSetSession = await setGameInSession(room_id, true);

  if (resSetSession.status !== "success") {
    cb && cb(resSetSession);
    return;
  }

  emit(room_id, "game start", Status({}, "success"));
};

const end_game = async (data, cb) => {
  let { room_id } = data;
  let { status: ses_status } = await setGameInSession(room_id, false);
  if (ses_status !== "success") return;

  emit(room_id, "game end");
};

const leave_game = async (data, cb) => {
  let { room_id, player_uuid } = data;
  cb && cb(); //allow player to leave game

  let resL = await leaveRoom(room_id, player_uuid);
  if (resL.status !== "success") return;

  let {
    status,
    data: { gameInSession },
  } = await getGameInSession(room_id);
  if (status !== "success") return;

  if (gameInSession) {
    //if in a game
    let { status: ses_status } = await setGameInSession(room_id, false);
    if (ses_status !== "success") return;

    emit(room_id, "game end");
  } else {
    //if in waiting room
    emit(room_id, "player left", Status({ player_uuid }, "success"));
  }
};

//called before every round starts
const reset = async (data, cb) => {
  let { room_id } = data;
  let res = await resetPlayers(room_id);
  cb && cb(res);
};

module.exports = init;
