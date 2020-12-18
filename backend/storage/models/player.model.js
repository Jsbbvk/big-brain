const mongoose = require("mongoose");

const options = {
    collection: "players",
};

const defaultPlayerStats = {
    classEnum: 0,
    modifierEnum: -1,
    answerEnum: 2,
    continueNextRound: false,
    votedPlayer: null,
    finishVoting: false,
    continueEndGame: false,
};

const playerSchema = mongoose.Schema(
    {
        roomId: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        stats: {
            votedPlayer: {
                type: String,
                default: defaultPlayerStats.votedPlayer,
            },
            finishVoting: {
                type: Boolean,
                default: defaultPlayerStats.finishVoting,
            },
            continueNextRound: {
                type: Boolean,
                default: defaultPlayerStats.continueNextRound,
            },
            continueEndGame: {
                type: Boolean,
                default: defaultPlayerStats.continueEndGame,
            },
            classEnum: {
                type: Number,
                default: defaultPlayerStats.classEnum,
            },
            modifierEnum: {
                type: Number,
                //NOTE reset this to -1 each round
                default: defaultPlayerStats.modifierEnum,
            },
            answerEnum: {
                type: Number,
                default: defaultPlayerStats.answerEnum,
            },
        },
        gameplay: {
            role: {
                type: Number,
                default: 0,
                //either Samaritan or Trickster
            },
        },
    },
    options
);

const Player = mongoose.model("Player", playerSchema);

module.exports = { Player, defaultPlayerStats };
