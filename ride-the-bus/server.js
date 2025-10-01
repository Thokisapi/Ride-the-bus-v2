const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/views'));


// Routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Ride the Bus' });
});

app.get('/lobby', (req, res) => {
    res.render('lobby',{title: 'lobby'});
})

app.get('/register',(req, res) =>{
    res.render('register', {title: 'Register'})
})
app.get('/login',(req, res) =>{
    res.render('login', {title: 'Login-page'})
})

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'Server is ready!' });
});

// WebSockets
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('ping', () => {
    socket.emit('pong', { message: 'Pong from server!' });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
