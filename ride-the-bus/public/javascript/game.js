 const socket = io();
  const roomList = document.getElementById('roomList');
  const createBtn = document.getElementById('createRoomBtn');
  const joinBtn = document.getElementById('joinBtn')

  createBtn.addEventListener('click', () => {
    socket.emit('createRoom');
  });

 socket.on('updateRooms', (rooms) => {
  const list = document.getElementById('roomList');
  list.innerHTML = '';

  rooms.forEach(room => {
    const div = document.createElement('div');
    div.className = 'p-3 bg-gray-700 rounded mb-2';
    div.innerHTML = `
      <div class="flex justify-between">
        <span class="font-bold">${room.code}</span>
        <span class="text-purple-400">Host: ${room.creator}</span>
      </div>
      <div class="text-sm text-gray-300">${room.playerCount} player(s)</div>
    `;
    list.appendChild(div);
  });
});

socket.emit('getRooms');