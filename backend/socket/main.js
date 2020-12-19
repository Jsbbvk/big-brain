let io;
const { dropCollection: dropPlayerCollection } = require("../storage/player");

const { dropCollection: dropRoomCollection } = require("../storage/room");

const connect = (server) => {
    io = require("socket.io")(server, {
        cors: {
            origin: ["http://localhost:3000", "https://big-brain.cf"],
            methods: ["GET", "POST"],
        },
    });
    init();
};

const emit = (room, emission, data) => {
    io.to(room).emit(emission, data);
};

const socket_emit = (socket, room, emission, data) => {
    socket.to(room).emit(emission, data);
};

const init = () => {
    //TODO remove
    dropPlayerCollection().then((res) =>
        console.log("reset player collection")
    );
    dropRoomCollection().then((res) => console.log("reset room collection"));

    io.on("connection", (socket) => {
        //console.log("connected");

        require("./room-socket")(socket);
        require("./player-socket")(socket);
        require("./gameplay-socket")(socket);

        socket.on("drop collections", () => {
            dropPlayerCollection();
            // .then((res) =>
            //   console.log("reset player collection")
            // );
            dropRoomCollection();
            // .then((res) => console.log("reset room collection"));
        });

        socket.on("disconnect", () => {
            // console.log("disconnected");
        });
    });
};

module.exports = { default: connect, emit, socket_emit };
