import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Form from './components/UsernameForm';
import Chat from './components/Chat';
import {produce} from 'immer';

import './App.css';

// const socket = io.connect('http://localhost:3001')

const initialMessageState = {
  general: [],
  notSilly: [],
  silly: [],
  minecraft: [],
};

function App() {
  const [username, setUsername] = useState('');
  const [connected, setConnected] = useState(false);
  const [currentChat, setCurrentChat] = useState({isChannel: true, chatName: 'general', receiverID: ''});
  const [connectedRooms, setConnectedRooms] = useState(['general']);
  const [allUsers, setAllUsers] = useState([]);
  const [messages, setMessages] = useState(initialMessageState);
  const [message, setMessage] = useState('');
  const socketRef = useRef();

  function handleChange(e) {
    setUsername(e.target.value);
  }

  function connect() {
    setConnected(true);
    socketRef.current = io.connect('http://localhost:3001')
    socketRef.current.emit('join_server', username);
    socketRef.current.emit('join_room', 'general', (messages) => roomJoinCallback(messages, 'general'))
    socketRef.current.on('new_user', allUsers => {
      setAllUsers(allUsers);
    });
    socketRef.current.on('new_message', ({content, sender, chatName}) => {
      setMessages(messages => {
        const newMessages = produce(messages, draft => {
          if (draft[chatName]) {
            draft[chatName].push({content, sender});
          } else {
            draft[chatName] = [{content, sender}];
          }
        });
        return newMessages;
      });
    });
  }

  function joinRoom(room) {
    const newConnectedRooms = produce(connectedRooms, draft => {
      draft.push(room);
    });

    socketRef.current.emit('join_room', room, (messages) => roomJoinCallback(messages, room));
    
    setConnectedRooms(newConnectedRooms);
  }

  function roomJoinCallback(incomingMessages, room) {
    const newMessages = produce(messages, draft => {
      draft[room] = incomingMessages;
    });
    setMessages(newMessages);
  }

  function handleMessageChange(e) {
    setMessage(e.target.value);
  }

  function sendMessage() {
    const payload = {
      content: message,
      roomNumber: currentChat.isChannel ? currentChat.chatName : currentChat.receiverID,
      sender: username,
      chatName: currentChat.chatName,
      isChannel: currentChat.isChannel,
    };

    socketRef.current.emit('send_message', payload);
    
    const newMessages = produce(messages, draft => {
      draft[currentChat.chatName].push({
        sender: username,
        content: message,
      });
    });
    setMessages(newMessages)
  }

  function toggleChat(currentChat) {
    if(!messages[currentChat.chatName]) {
      const newMessages = produce(messages, draft => {
        draft[currentChat.chatName] = [];
      });
      setMessages(newMessages)
    }
    setCurrentChat(currentChat)
  }

  let body;
  if (connected) {
    body = (
      <Chat
        message={message}
        handleMessageChange={handleMessageChange}
        sendMessage={sendMessage}
        yourID={socketRef.current ? socketRef.current.id : ''}
        allUsers={allUsers}
        joinRoom={joinRoom}
        connectedRooms={connectedRooms}
        currentChat={currentChat}
        toggleChat={toggleChat}
        messages={messages[currentChat.chatName]}
      />
    )
  } else {
    body = (
      <Form username={username} onChange={handleChange} connect={connect} />
    );
  }

  useEffect(() => {
    setMessage('')
  }, [messages]);

  return (
    <div className='App'>
      {body}
    </div>
  );
}

export default App;
