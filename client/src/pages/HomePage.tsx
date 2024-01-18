import { useEffect, useState, useRef, ChangeEvent } from 'react';
import { Socket } from "socket.io-client";
import { produce } from 'immer';
import * as io from "socket.io-client";

import styled from 'styled-components';
import Sidebar from '../components/Sidebar';
import Chat from '../components/Chat';

interface Message {
  content: string;
  sender: string;
}

interface User {
  id: string;
  username: string;
}

interface Room {
  name: string;
  host: string | null;
}

interface ChatState {
  isChannel: boolean;
  chat: Room;
  receiverID: string;
}

const initialMessageState: { [key: string]: Message[] } = {
  general: [],
};

const initialRoomState: Room[] = [
  { name: 'general', host: null },
];

function HomePage({ username }: { username: string }): JSX.Element {
  const [connected, setConnected] = useState(false);
  const [currentChat, setCurrentChat] = useState<ChatState>({ isChannel: true, chat: { name: 'general', host: null }, receiverID: '' });
  const [connectedRooms, setConnectedRooms] = useState<Room[]>(initialRoomState);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [messages, setMessages] = useState(initialMessageState);
  const [message, setMessage] = useState('');

  const socketRef = useRef<Socket | undefined>();

  function handleConnect() {
    connect(username);
  }

  function connect(username: string) {
    setConnected(true);
    socketRef.current = io.connect('http://localhost:3001');
    socketRef.current.emit('join_server', username);
    socketRef.current.emit('join_room', initialRoomState[0], (receivedMessages: Message[]) => roomJoinCallback(receivedMessages, initialRoomState[0]));

    socketRef.current?.on('new_user', (newUsers: User[]) => {
      setAllUsers(newUsers);
    });

    socketRef.current?.on('new_message', ({ content, sender, chatName }: { content: string, sender: string, chatName: string }) => {
      setMessages(prevMessages => {
        const newMessages = produce(prevMessages, draft => {
          if (draft[chatName]) {
            draft[chatName].push({ content, sender });
          } else {
            draft[chatName] = [{ content, sender }];
          }
        });
        return newMessages;
      });
    });
  }

  function joinRoom(room: Room) {
    const newConnectedRooms = produce(connectedRooms, draft => {
      draft.push(room);
    });

    socketRef.current?.emit('join_room', room, (receivedMessages: Message[], newRoom: Room) => roomJoinCallback(receivedMessages, newRoom));

    setConnectedRooms(newConnectedRooms);
  }

  function roomJoinCallback(incomingMessages: Message[], newRoom: Room) {
    const newAllRooms = produce(allRooms, draft => {
      draft.push(newRoom);
    });
    setAllRooms(newAllRooms);

    const newMessages = produce(messages, draft => {
      draft[newRoom.name] = incomingMessages;
    });
    setMessages(newMessages);
  }

  function handleMessageChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setMessage(e.target.value);
  }

  function sendMessage() {
    const payload = {
      content: message,
      roomNumber: currentChat.isChannel ? currentChat.chat.name : currentChat.receiverID,
      sender: username,
      chatName: currentChat.chat.name,
      isChannel: currentChat.isChannel,
    };

    socketRef.current?.emit('send_message', payload);

    const newMessages = produce(messages, draft => {
      draft[currentChat.chat.name].push({
        sender: username,
        content: message,
      });
    });
    setMessages(newMessages);
  }

  function toggleChat(newChat: ChatState) {
    if (!messages[newChat.chat.name]) {
      const newMessages = produce(messages, draft => {
        draft[newChat.chat.name] = [];
      });
      setMessages(newMessages);
    }
    setCurrentChat(newChat);
  }

  function createRoom(roomName: string, hostName: string) {
    const newRoom: Room = { name: roomName, host: hostName };
    joinRoom(newRoom);
  }

  useEffect(() => {
    setMessage('');
  }, [messages]);

  return (
    <div className='App'>
      {!connected ? (
        <button onClick={handleConnect}>Connect</button>
      ) : (
        <Container>
          <Sidebar
            allRooms={allRooms}
            allUsers={allUsers}
            yourID={socketRef.current?.id || ''}
            createRoom={createRoom}
            sendMessage={sendMessage}
            toggleChat={toggleChat}
          />
          <Chat
            message={message}
            handleMessageChange={handleMessageChange}
            sendMessage={sendMessage}
            yourID={socketRef.current?.id || ''}
            allUsers={allUsers}
            allRooms={allRooms}
            joinRoom={joinRoom}
            createRoom={createRoom}
            connectedRooms={connectedRooms}
            currentChat={currentChat}
            toggleChat={toggleChat}
            messages={messages[currentChat.chat.name]}
          />
        </Container>
      )}
    </div>
  );
}

const Container = styled.div`
    height: 100vh;
    width: 100%;
    display: flex;
`;

export default HomePage;