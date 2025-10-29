 const socket = io();
  const roomList = document.getElementById('roomList');
  const createBtn = document.getElementById('createRoomBtn');

  createBtn.addEventListener('click', () => {
    socket.emit('createRoom');
  });

  socket.on('updateRooms', (rooms) => {
    roomList.innerHTML = '';
    rooms.forEach(room => {
      const div = document.createElement('div');
      div.textContent = room;
      div.className = 'bg-gray-700 px-4 py-2 rounded cursor-pointer hover:bg-gray-500';
      div.addEventListener('click', () => socket.emit('joinRoom', room));
      roomList.appendChild(div);
    });
  });