import { socket } from "./main";

export const create_listener = (emission, cb) => {
  socket.on(emission, (data) => {
    cb && cb(data);
  });
};

export const create_once_listener = (emission, cb) => {
  socket.once(emission, (data) => {
    cb && cb(data);
  });
};

export const remove_listener = (emission) => {
  socket.removeAllListeners(emission);
};
