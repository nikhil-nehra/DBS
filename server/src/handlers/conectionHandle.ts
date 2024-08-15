import { Server, Socket } from 'socket.io';
import { User } from '../types/roomInfoTypes';

export function handleJoinServer(socket: Socket, io: Server, users: User[], username: string): void {
  const user: User = {
    username,
    id: socket.id,
  };
  users.push(user);
  io.emit('new_user', users);
  console.log(users);
}

export function handleDisconnect(socket: Socket, io: Server, users: User[]): void {
  const updatedUsers = users.filter((u) => u.id !== socket.id);
  io.emit('new_user', updatedUsers);
}
