// socket.js
const { Server } = require('socket.io');
const cors = require('cors');

const users = [];
const messages = {
  general: [],
  notSilly: [],
  silly: [],
  minecraft: [],
};

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    socket.on('join_server', (username) => {
      const user = {
        username,
        id: socket.id,
      };
      users.push(user);
      io.emit('new_user', users);
      console.log(users);
    });

    socket.on('join_room', (roomName, callBack) => {
      socket.join(roomName);
      callBack(messages[roomName]);
    });

    socket.on('send_message', ({ content, roomNumber, sender, chatName, isChannel }) => {
      if (isChannel) {
        const payload = {
          content,
          chatName,
          sender,
        };
        socket.to(roomNumber).emit('new_message', payload);
      } else {
        const payload = {
          content,
          chatName: sender,
          sender,
        };
        socket.to(roomNumber).emit('new_message', payload);
      }

      if (messages[chatName]) {
        messages[chatName].push({
          sender,
          content,
        });
      }
    });

    socket.on('disconnect', () => {
      users = users.filter(u => u.id !== socket.id);
      io.emit('new_user', users);
    });
  });
}

module.exports = setupSocket;
