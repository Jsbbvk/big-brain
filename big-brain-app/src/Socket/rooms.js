import { socket } from "./main";

export const create_and_join_room = (roomId, username) => {
  return new Promise((resolve, reject) => {
    socket.emit("create room", { roomId, username }, (res) => {
      resolve(res);
    });
  });
};

export const join_room = (roomId, username) => {
  return new Promise((resolve, reject) => {
    socket.emit("join room", { roomId, username }, (res) => {
      resolve(res);
    });
  });
};

export const leave_room = (room_id, player_uuid) => {
  return new Promise((resolve, reject) => {
    socket.emit("leave game", { room_id, player_uuid }, (res) => {
      resolve(res);
    });
  });
};

export const end_game = (room_id) => {
  return new Promise((resolve, reject) => {
    socket.emit("end game", { room_id }, (res) => {
      resolve(res);
    });
  });
};
