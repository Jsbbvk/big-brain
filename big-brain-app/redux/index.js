import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducer from "./reducers";

const initialState = {
  //5 digit code
  roomId: "",
  player: {
    uuid: "",
    name: "",
    //keeps track of player's stats
    stats: {},
  },
};

export const makeStore = (context) =>
  createStore(reducer, initialState, applyMiddleware(thunk));
