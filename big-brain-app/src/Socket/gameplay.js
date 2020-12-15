import { socket } from "./main";

export const get_can_call_vote = (room_id) => {
  return new Promise((resolve) => {
    socket.emit("get can call vote", { room_id }, (res) => {
      resolve(res);
    });
  });
};

export const call_vote = (room_id) => {
  return new Promise((resolve) => {
    socket.emit("call vote", { room_id }, (res) => {
      resolve(res);
    });
  });
};

export const start_game = (room_id) => {
  return new Promise((resolve) => {
    socket.emit("start game", { room_id }, (res) => {
      resolve(res);
    });
  });
};

export const get_room_stats = (room_id) => {
  return new Promise((resolve) => {
    socket.emit("get room stats", { room_id }, (res) => {
      resolve(res);
    });
  });
};

export const get_players = (room_id) => {
  return new Promise((resolve) => {
    socket.emit("get players", { room_id }, (res) => resolve(res));
  });
};

export const get_skips_left = (room_id) => {
  return new Promise((resolve) => {
    socket.emit("get skips left", { room_id }, (res) => resolve(res));
  });
};

export const get_question = (room_id) => {
  return new Promise((resolve) => {
    socket.emit("get round question", { room_id }, (res) => resolve(res));
  });
};

export const get_timer = (room_id) => {
  return new Promise((resolve) => {
    socket.emit("get round timer", { room_id }, (res) => resolve(res));
  });
};

export const drop_collections = () => {
  socket.emit("drop collections");
};
