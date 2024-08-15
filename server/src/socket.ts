// socket.ts
import { Server, Socket } from 'socket.io';
import * as http from 'http';
import { User, Room, Messages } from './types/roomInfoTypes';

import { handleJoinServer, handleDisconnect } from './handlers/conectionHandle';
import { handleJoinRoom, handleSendMessage } from './handlers/roomHandle';

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
    socket.on('join_server', (username: string) => handleJoinServer(socket, io, users, username));
    socket.on('join_room', (room: Room, callBack) => handleJoinRoom(socket, rooms, messages, room, callBack));
    socket.on('send_message', (data) => handleSendMessage(socket, data, messages));
    socket.on('disconnect', () => handleDisconnect(socket, io, users));
  });
}

module.exports = setup;
