const { Server } = require('socket.io');

let io;

module.exports = {
    init: (httpServer) => {
        io = new Server(httpServer, {
            cors: {
                origin: 'http://localhost:5173',
                methods: ['GET', 'POST'],
            },
        });

        io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);

            // Handle real-time notifications
            socket.on('joinRoom', (userId) => {
                socket.join(`user-${userId}`);
                console.log(`User ${userId} joined their room`);
            });

            // Handle report updates
            socket.on('reportUpdate', (data) => {
                io.to(`user-${data.userId}`).emit('reportUpdated', data);
            });

            // Handle assessment notifications
            socket.on('assessmentCreated', (data) => {
                io.to(`user-${data.recipientId}`).emit('newAssessment', data);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
        });

        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error('Socket.io not initialized!');
        }
        return io;
    },
};
