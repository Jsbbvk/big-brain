import Constants from "./constants";

export const set_player_stats = (stats) => ({
  type: Constants.SET_PLAYER_STATS,
  stats,
});

export const set_player = (player) => ({
  type: Constants.SET_PLAYER,
  player,
});

export const set_room_id = (roomId) => ({
  type: Constants.SET_ROOM_ID,
  roomId,
});
