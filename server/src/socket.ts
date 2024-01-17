// socket.ts
import { Server, Socket } from 'socket.io';
import * as http from 'http';

interface User {
  username: string;
  id: string;
}

interface Room {
  name: string;
  host: string | null;
}

interface Messages {
  [key: string]: { sender: string; content: string }[];
}

function setup(server: http.Server): void {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  let users: User[] = [];
  let rooms: Room[] = [
    { name: 'general', host: null },
  ];
  const messages: Messages = {
    general: [],
  };

  io.on('connection', (socket: Socket) => {
    socket.on('join_server', (username: string) => {
      const user: User = {
        username,
        id: socket.id,
      };
      users.push(user);
      io.emit('new_user', users);
      console.log(users);
    });

    socket.on('join_room', (room: Room, callBack: (messages: { sender: string; content: string }[], newRoom: Room) => void) => {
      const existingRoom = rooms.find((roomInRooms) => roomInRooms.name === room.name);

      if (existingRoom === undefined) {
        room = { name: room.name, host: room.host };
        rooms.push(room);
        messages[room.name] = [];
      } else {
        room = existingRoom;
      }

      socket.join(room.name);
      callBack(messages[room.name], room);
    });

    socket.on('send_message', ({ content, roomNumber, sender, chatName, isChannel }: { content: string; roomNumber: string; sender: string; chatName: string; isChannel: boolean }) => {
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
      users = users.filter((u) => u.id !== socket.id);
      io.emit('new_user', users);
    });
  });
}

module.exports = setup;
