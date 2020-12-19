import io from "socket.io-client";

let socket = null;

export const init_socket = async () => {
    socket = await io.connect(process.env.SOCKET_PORT, { secure: true });
};

export const emission = async (emission, data) => {
    return new Promise((resolve) =>
        socket.emit(emission, data, (res) => resolve(res))
    );
};

export { socket };
