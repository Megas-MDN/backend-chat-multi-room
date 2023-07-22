require('dotenv/config');
const server = require('http').createServer();
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});

const CHAT = process.env.CHAT_NAME;
const CHAT_GLOBAL = process.env.GLOBAL_CHAT;

io.on('connection', (socket) => {
  const { roomId } = socket.handshake.query;
  console.log('Socket id :: %s :: room :: %s ::', socket.id, roomId);

  if (roomId) {
    socket.join(roomId);
  }

  socket.on(CHAT, (data) => {
    io.in(roomId).emit(CHAT, data);
  });

  socket.on(CHAT_GLOBAL, (data) => {
    socket.emit(CHAT_GLOBAL, data);
    socket.broadcast.emit(CHAT_GLOBAL, data);
  });

  socket.on('disconnect', (reason) => {
    console.log(reason, '<:::', socket.id);
    socket.leave(roomId);
  });
});

const port = process.env.PORT || 3001;

server.listen(port, () => console.log('Server ON :: %s ::', port));
