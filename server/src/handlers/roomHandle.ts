import { Socket } from 'socket.io';
import { Room, Messages } from '../types/roomInfoTypes';

export function handleJoinRoom(
    socket: Socket,
    rooms: Room[],
    messages: Messages,
    room: Room,
    callBack: (messages: { sender: string; content: string }[], newRoom: Room) => void
  ): void {
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
  }
  
  export function handleSendMessage(
    socket: Socket,
    { content, roomNumber, sender, roomName, isChannel }: { content: string; roomNumber: string; sender: string; roomName: string; isChannel: boolean },
    messages: Messages
  ): void {
    const payload = {
      content,
      roomName: isChannel ? roomName : sender,
      sender,
    };
  
    socket.to(roomNumber).emit('new_message', payload);
  
    if (messages[roomName]) {
      messages[roomName].push({
        sender,
        content,
      });
    }
  }