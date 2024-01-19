import {ChangeEvent, KeyboardEvent } from 'react';
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
  joinRoom: (roomName: Room) => void;
  sendMessage: () => void;
  messages: Message[];
  currentRoom: RoomState;
  connectedRooms: Room[];
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

const Messages = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

export default Chat;
