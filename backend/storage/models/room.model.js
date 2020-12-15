const mongoose = require("mongoose");

const options = {
  collection: "rooms",
};

const defaultRoomStats = {
  points: {
    samaritan: 0,
    trickster: 0,
  },
  skipsLeft: 3,
  canCallVote: {
    numRounds: 0,
    allow: true,
  },
  votedPlayer: null,
};

const defaultRoundInfo = {
  timer: {
    roundDurationInSeconds: 45,
    roundStartTime: null,
  },
  question: "",
  answers: {
    options: [],
    correctEnum: null,
  },
  modifiers: {
    trickster: {
      enum: 0,
      player_uuid: null,
    },
    samaritans: [],
  },
};

const pointsToWin = {
  samaritan: 5,
  trickster: 3,
};

const roomSchema = mongoose.Schema(
  {
    roomId: {
      type: Number,
      required: true,
      unique: true,
    },
    players: [
      {
        type: mongoose.Schema.Types.ObjectID,
        ref: "Player",
      },
    ],
    //reset every game session
    stats: {
      votedPlayer: {
        type: mongoose.Schema.Types.ObjectID,
        ref: "Player",
        default: defaultRoomStats.votedPlayer,
      },
      points: {
        samaritan: {
          type: Number,
          default: defaultRoomStats.points.samaritan,
        },
        trickster: {
          type: Number,
          default: defaultRoomStats.points.trickster,
        },
      },
      skipsLeft: {
        type: Number,
        default: defaultRoomStats.skipsLeft,
      },
      canCallVote: {
        numRounds: {
          type: Number,
          default: defaultRoomStats.canCallVote.numRounds,
        },
        allow: {
          type: Boolean,
          default: defaultRoomStats.canCallVote.allow,
        },
      },
    },
    //changed every round
    roundInfo: {
      modifiers: {
        trickster: {
          enum: {
            type: Number,
            default: defaultRoundInfo.modifiers.trickster.enum,
          },
          player_uuid: {
            type: mongoose.Schema.Types.ObjectID,
            ref: "Player",
            default: defaultRoundInfo.modifiers.trickster.player_uuid,
          },
        },
        samaritans: {
          type: [
            {
              enum: {
                type: Number,
                default: 0,
              },
              player_uuid: {
                type: mongoose.Schema.Types.ObjectID,
                ref: "Player",
              },
            },
          ],
          default: defaultRoundInfo.modifiers.samaritans,
        },
      },
      timer: {
        roundStartTime: {
          type: Date,
        },
        roundDurationInSeconds: {
          type: Number,
          default: defaultRoundInfo.timer.roundDurationInSeconds,
        },
      },
      question: {
        type: String,
        default: defaultRoundInfo.question,
      },
      answers: {
        options: {
          type: [String],
          default: defaultRoundInfo.answers.options,
        },
        correctEnum: {
          type: Number,
        },
      },
    },
    gameplay: {
      gameInSession: {
        type: Boolean,
        default: false,
      },
      trickster: {
        type: mongoose.Schema.Types.ObjectID,
        ref: "Player",
      },
      playerLimit: {
        type: Number,
        default: 5,
      },
    },
  },
  options
);

roomSchema.index({ roomId: 1 });

const Room = mongoose.model("Room", roomSchema);

module.exports = { Room, defaultRoomStats, defaultRoundInfo, pointsToWin };
