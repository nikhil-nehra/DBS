import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import styled from 'styled-components';

interface Room {
  name: string;
  host: string | null;
}

interface User {
  id: string;
  username: string;
}

interface Message {
  sender: string;
  content: string;
}

interface ChatProps {
  toggleRoom: (room: RoomState) => void;
  joinRoom: (roomName: Room) => void;
  createRoom: (roomName: string, hostName: string) => void;
  sendMessage: () => void;
  yourID: string;
  messages: Message[];
  currentRoom: RoomState;
  connectedRooms: Room[];
  allRooms: Room[];
  allUsers: User[];
  message: string;
  handleMessageChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

interface RoomState {
  isChannel: boolean;
  room: Room;
  receiverID: string;
}

function Chat(props: ChatProps): JSX.Element  {
    function renderMessages(message: Message, index: number) {
        return (
            <div key={index}>
                <h3>{message.sender}</h3>
                <p>{message.content}</p>
            </div>
        );
    }

    let chatBody;
    if (!props.currentRoom.isChannel || props.connectedRooms.some(room => room.name === props.currentRoom.room.name)) {
        chatBody = (
            <Messages>
                {props.messages.map(renderMessages)}
            </Messages>
        );
    } else {
        chatBody = (
            <button onClick={() => props.joinRoom(props.currentRoom.room)}>Join {props.currentRoom.room.name}</button>
        );
    }

    const handleMessageKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            props.sendMessage();
        }
    };

    const findUsernameById = (userId: string) => {
        const user = props.allUsers.find(user => user.id === userId);
        return user?.username || '';
    };

    return (
        <ChatPanel>
            <ChatContainer>
                {chatBody}
            </ChatContainer>
            <TextBox
                value={props.message}
                onChange={props.handleMessageChange}
                onKeyUp={handleMessageKeyPress}
                placeholder='say something'
            />
        </ChatPanel>
    );
}

const RoomPanel = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const RoomContainer = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
`;

const ChatPanel = styled.div`
    height: 100%;
    width: 100%;
    flex: .25;
`;

const ChatContainer = styled.div`
    width: 100%;
    height: 85%;
    overflow: scroll;
    border-bottom: 1px solid black;
`;

const TextBox = styled.textarea`
    height: 15%;
    width: 100%;
`;

const ChannelInfo = styled.div`
    height: 10%;
    width: 100%;
    border-bottom: 1px solid black;
`;

const Messages = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

export default Chat;
