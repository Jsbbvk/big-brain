import { socket } from "./main";

export const continue_to_next_round = (room_id, player_uuid) => {
  return new Promise((resolve) => {
    socket.emit(
      "player continue to next round",
      { room_id, player_uuid },
      (res) => resolve(res)
    );
  });
};

export const set_class = (room_id, player_uuid, classEnum) => {
  return new Promise((resolve, reject) => {
    socket.emit("select class", { room_id, player_uuid, classEnum }, (res) => {
      resolve(res);
    });
  });
};

export const set_modifier = (room_id, player_uuid, modifierEnum) => {
  return new Promise((resolve, reject) => {
    socket.emit(
      "select modifier",
      { room_id, player_uuid, modifierEnum },
      (res) => {
        resolve(res);
      }
    );
  });
};

export const set_answer = (room_id, player_uuid, answerEnum) => {
  return new Promise((resolve, reject) => {
    socket.emit(
      "select answer",
      { room_id, player_uuid, answerEnum },
      (res) => {
        resolve(res);
      }
    );
  });
};

export const get_player_number = (room_id, player_uuid) => {
  return new Promise((resolve, reject) => {
    socket.emit("get player number", { room_id, player_uuid }, (res) => {
      resolve(res);
    });
  });
};

export const get_player_role = (player_uuid) => {
  return new Promise((resolve, reject) => {
    socket.emit("get player role", { player_uuid }, (res) => {
      resolve(res);
    });
  });
};
