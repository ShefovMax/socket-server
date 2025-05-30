import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);

const elements = [];

const io = new Server(httpServer, {
  cors: {
    origin: '*', // лучше заменить на домен фронтенда на продакшене
  },
});

app.get('/', (req, res) => {
  res.send('Socket.IO server is running');
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // При подключении отдаем текущие элементы
  socket.emit('init', elements);

  socket.on('draw', (data) => {
    elements.push(data);
    socket.broadcast.emit('draw', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
