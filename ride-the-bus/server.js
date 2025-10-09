const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const registerroute = require('./routes/register')
app.use(express.static(path.join(__dirname, 'public')));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/views'));


app.get('/', (req, res) => {
  res.render('index', { title: 'Ride the Bus' });
});

app.get('/lobby', (req, res) => {
    res.render('lobby',{title: 'lobby'});
})

app.get('/register',(req, res) =>{
    res.render('register',  registerroute,{title: 'Register'})
})
app.get('/login',(req, res) =>{
    res.render('login', {title: 'Login-page'})
})



io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('ping', () => {
    socket.emit('pong', { message: 'Pong from server!' });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});



mongoose.connect('mongodb://127.0.0.1:27017/ride-the-bus', {
  
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
