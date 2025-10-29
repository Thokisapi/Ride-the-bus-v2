// sockets/gameHandler.js
module.exports = (io) => {
  // Store rooms in memory
  const rooms = {};

  io.on('connection', (socket) => {
    console.log('🔌 New connection:', socket.id);

    socket.on('createRoom', () => {
      const roomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
      rooms[roomCode] = { players: [socket.id] };
      socket.join(roomCode);
      console.log(`🏠 Room created: ${roomCode}`);

      io.emit('updateRooms', Object.keys(rooms)); // send updated list to all clients
      io.to(socket.id).emit('roomCreated', { roomCode });
    });

    socket.on('joinRoom', (roomCode) => {
      if (rooms[roomCode]) {
        rooms[roomCode].players.push(socket.id);
        socket.join(roomCode);
        io.to(roomCode).emit('playerJoined', { player: socket.id });
      } else {
        socket.emit('errorMsg', { message: 'Room not found!' });
      }
    });

    socket.on('disconnect', () => {
      for (const [code, room] of Object.entries(rooms)) {
        room.players = room.players.filter((id) => id !== socket.id);
        if (room.players.length === 0) delete rooms[code];
      }
      io.emit('updateRooms', Object.keys(rooms));
      console.log(`${socket.id} disconnected`);
    });
  });
};
