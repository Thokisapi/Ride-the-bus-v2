module.exports = (io) => {
  const rooms = {};

  io.on("connection", (socket) => {
    const user = socket.handshake.session.user;
    console.log(`User connected: ${socket.id}`, user);

    socket.on("createRoom", () => {
      const user = socket.handshake.session.user;
      if (!user) {
        socket.emit("errormessage", { message: "You must be logged in to create a room." });
        return;
      }

      const username = user.username;
      const roomCode = Math.random().toString(36).substring(2, 7).toUpperCase();

      rooms[roomCode] = {
        code: roomCode,
        creator: username,
        players: [{ id: socket.id, name: username }],
      };

      socket.join(roomCode);
      console.log(`Room ${roomCode} by ${username}`);

      io.emit(
        "updateRooms",
        Object.values(rooms).map((room) => ({
          code: room.code,
          creator: room.creator,
          playerCount: room.players.length,
        }))
      );

      socket.emit("roomCreated", { roomCode, creator: username });
    });

    socket.on("getRooms", () => {
      socket.emit("updateRooms", formatRooms());
    });

    function formatRooms() {
      return Object.keys(rooms).map((code) => ({
        code,
        creator: rooms[code].creator,
        playerCount: rooms[code].players.length,
      }));
    }

    socket.on("joinRoom", (roomCode) => {
      if (rooms[roomCode]) {
        rooms[roomCode].players.push(socket.id);
        socket.join(roomCode);
        io.to(roomCode).emit("playerJoined", { player: socket.id });
      } else {
        socket.emit("errorMsg", { message: "Room not found!" });
      }
    });

    socket.on("disconnect", () => {
      for (const [code, room] of Object.entries(rooms)) {
        room.players = room.players.filter((id) => id !== socket.id);
        if (room.players.length === 0) delete rooms[code];
      }
      io.emit("updateRooms", Object.keys(rooms));
      console.log(`${socket.id} disconnected`);
    });
  });
};
