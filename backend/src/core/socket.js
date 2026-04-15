let io;

module.exports = {
  init: (httpServer) => {
    const { Server } = require('socket.io');
    io = new Server(httpServer, {
      cors: {
        origin: '*', // For demo purposes, in prod restrict this
        methods: ['GET', 'POST', 'PUT', 'DELETE']
      }
    });

    // Track connected clients
    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      const onlineCount = io.engine.clientsCount;
      io.emit('online-count', onlineCount);
      
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        const onlineCount = io.engine.clientsCount;
        io.emit('online-count', onlineCount);
      });
    });

    return io;
  },
  getIo: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  }
};
