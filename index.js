import express from 'express'
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: '*',
  serveClient: false
})

io.on("connection", (socket) => {
  socket.emit("init", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", ({ to, from, signal }) => {
    io.to(to).emit("callUser", { signal, from });
  });

  socket.on("answerCall", ({ to, signal }) => {
    io.to(to).emit("callAccepted", { signal });
  });
});

server.listen(5050, () => {
  console.info('Server listening on port 5050');
});
