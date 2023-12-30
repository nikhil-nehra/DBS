import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Chat from '../components/Chat';
import { produce } from 'immer';

const initialMessageState = {
  general: [],
};

const initialRoomState = [
  { name: 'general', host: null },
]

function HomePage({ username }) {
  const [connected, setConnected] = useState(false);
  const [currentChat, setCurrentChat] = useState({ isChannel: true, chat: { name: 'general', host: null }, receiverID: '' });
  const [connectedRooms, setConnectedRooms] = useState(initialRoomState);
  const [allUsers, setAllUsers] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [messages, setMessages] = useState(initialMessageState);
  const [message, setMessage] = useState('');
  const socketRef = useRef();

  function handleConnect() {
    connect(username);
  }

  function connect(username) {
    setConnected(true);
    socketRef.current = io.connect('http://localhost:3001');
    socketRef.current.emit('join_server', username);
    socketRef.current.emit('join_room', initialRoomState[0], (messages) => roomJoinCallback(messages, initialRoomState[0]))
    socketRef.current.on('new_user', allUsers => {
      setAllUsers(allUsers);
    });
    socketRef.current.on('new_message', ({content, sender, chatName}) => {
      console.log('New_Message');
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
    socketRef.current.emit('join_room', room, (messages, newRoom) => roomJoinCallback(messages, newRoom));
    
    setConnectedRooms(newConnectedRooms);
  }

  function roomJoinCallback(incomingMessages, newRoom) {
    // Update state using immer to add the new room to allRooms
    const newAllRooms = produce(allRooms, draft => {
      draft.push(newRoom);
    })
    setAllRooms(newAllRooms);

    console.log(newRoom)

    const newMessages = produce(messages, draft => {
      draft[newRoom.name] = incomingMessages;
    });
    setMessages(newMessages);

    console.log(messages)
  }

  function handleMessageChange(e) {
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

    socketRef.current.emit('send_message', payload);
    
    const newMessages = produce(messages, draft => {
      draft[currentChat.chat.name].push({
        sender: username,
        content: message,
      });
    });
    setMessages(newMessages)
  }

  function toggleChat(currentChat) {
    if(!messages[currentChat.chat.name]) {
      const newMessages = produce(messages, draft => {
        draft[currentChat.chat.name] = [];
      });
      setMessages(newMessages)
    }
    setCurrentChat(currentChat)
    console.log(currentChat)
  }

  function createRoom(roomName, hostName) {
    // Unique room name (use a more sophisticated method later)
    const newRoom = {name: roomName, host: hostName};

    // Update state to join the new room
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
        <Chat
          message={message}
          handleMessageChange={handleMessageChange}
          sendMessage={sendMessage}
          yourID={socketRef.current ? socketRef.current.id : ''}
          allUsers={allUsers}
          allRooms={allRooms}
          joinRoom={joinRoom}
          createRoom={createRoom}
          connectedRooms={connectedRooms}
          currentChat={currentChat}
          toggleChat={toggleChat}
          messages={messages[currentChat.chat.name]}
        />
      )}
    </div>
  );
}

export default HomePage;