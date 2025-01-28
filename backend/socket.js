const { Server } = require('socket.io');

let io;

module.exports = {
    init: (httpServer) => {
        io = new Server(httpServer, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            },
        });
        return io;
    },
    get io() {
        if (!io) {
            throw new Error('Socket.io not initialized!');
        }
        return io;
    },
};
