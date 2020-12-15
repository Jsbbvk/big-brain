import produce from "immer";
import { enableAllPlugins } from "immer";
import Constants from "./constants";

enableAllPlugins();

const reducer = (state, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case Constants.SET_PLAYER_STATS: {
        draft.player.stats = {
          ...draft.player.stats,
          ...action.stats,
        };
        return draft;
      }

      case Constants.SET_PLAYER: {
        draft.player = { ...draft.player, ...action.player };

        return draft;
      }

      case Constants.SET_ROOM_ID: {
        draft.roomId = action.roomId;
        return draft;
      }

      default: {
        return draft;
      }
    }
  });

export default reducer;
