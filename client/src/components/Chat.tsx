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
  toggleChat: (chat: ChatState) => void;
  joinRoom: (roomName: Room) => void;
  createRoom: (roomName: string, hostName: string) => void;
  sendMessage: () => void;
  yourID: string;
  messages: Message[];
  currentChat: ChatState;
  connectedRooms: Room[];
  allRooms: Room[];
  allUsers: User[];
  message: string;
  handleMessageChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

interface ChatState {
  isChannel: boolean;
  chat: Room;
  receiverID: string;
}

const Container = styled.div`
    height: 100vh;
    width: 100%;
    display: flex;
`;

const SideBar = styled.div`
    height: 100%;
    width: 15%;
    border-right: 1px solid black;
`;

const ChatPanel = styled.div`
    height: 100;
    width: 85%;
    display: flex;
    flex-direction: column;
`;

const BodyContainer = styled.div`
    width: 100%;
    height: 75%;
    overflow: scroll;
    border-bottom: 1px solid black;
`;

const TextBox = styled.textarea`
    height: 15%;
    width: 100%;
`;

const RoomNameBox = styled.input`
    height: 15px;
    width: 100%;
    padding: 5px;
    box-sizing: border-box;
`;

const ChannelInfo = styled.div`
    height: 10%;
    width: 100%;
    border-bottom: 1px solid black;
`;

const Row = styled.div`
    cursor: pointer;
`;

const Messages = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

function Chat(props: ChatProps): JSX.Element  {
    const [isCreatingRoom, setIsCreatingRoom] = useState(false);
    const [newRoomName, setNewRoomName] = useState('');

    function renderRooms(room: Room) {
        const currentChat: ChatState = {
            isChannel: true,
            chat: room,
            receiverID: '',
        };
        return (
            <Row onClick={() => props.toggleChat(currentChat)} key={room.name}>
                {room.name}
            </Row>
        );
    }

    function renderUsers(user: User) {
        if (user.id === props.yourID) {
            return (
                <Row key={user.id}>
                    You: {user.username}
                </Row>
            );
        }
        const currentChat: ChatState = {
            isChannel: false,
            chat: { name: user.username, host: null },
            receiverID: user.id,
        };
        return (
            <Row onClick={() => {
                props.toggleChat(currentChat);
            }} key={user.id}>
                {user.username}
            </Row>
        );
    }

    function renderMessages(message: Message, index: number) {
        return (
            <div key={index}>
                <h3>{message.sender}</h3>
                <p>{message.content}</p>
            </div>
        );
    }

    let body;
    if (!props.currentChat.isChannel || props.connectedRooms.some(room => room.name === props.currentChat.chat.name)) {
        body = (
            <Messages>
                {props.messages.map(renderMessages)}
            </Messages>
        );
    } else {
        body = (
            <button onClick={() => props.joinRoom(props.currentChat.chat)}>Join {props.currentChat.chat.name}</button>
        );
    }

    const handleCreateRoomClick = () => {
        setIsCreatingRoom(true);
    };

    const handleCreateRoomCancel = () => {
        setIsCreatingRoom(false);
    };

    const handleCreateRoom = () => {
        if (newRoomName.trim() !== '') {
            props.createRoom(newRoomName, props.yourID);

            setIsCreatingRoom(false);
            setNewRoomName('');
        }
    };

    const handleRoomNameKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleCreateRoom();
        }
    };

    const handleMessageKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            props.sendMessage();
        }
    };

    const handleCreateRoomUI = () => {
        if (isCreatingRoom) {
            return (
                <>
                    <RoomNameBox
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                        onKeyUp={handleRoomNameKeyPress}
                        placeholder='Enter room name'
                    />
                    <button onClick={handleCreateRoomCancel}>Cancel</button>
                </>
            );
        } else {
            return <button onClick={handleCreateRoomClick}>Create Room</button>;
        }
    };

    const findUsernameById = (userId: string) => {
        const user = props.allUsers.find(user => user.id === userId);
        return user?.username || '';
    };

    return (
        <Container>
            <SideBar>
                <h3>Channels</h3>
                {props.allRooms.map(renderRooms)}
                {handleCreateRoomUI()}
                <h3>All Users</h3>
                {props.allUsers.map(renderUsers)}
            </SideBar>
            <ChatPanel>
                <ChannelInfo>
                    {props.currentChat.chat.name}
                    {props.currentChat.chat.host !== null && (
                        <>
                            <br />
                            <span style={{ fontSize: '0.8em', color: 'grey' }}>
                                Host: {findUsernameById(props.currentChat.chat.host)}
                            </span>
                        </>
                    )}
                </ChannelInfo>
                <BodyContainer>
                    {body}
                </BodyContainer>
                <TextBox
                    value={props.message}
                    onChange={props.handleMessageChange}
                    onKeyUp={handleMessageKeyPress}
                    placeholder='say something'
                />
            </ChatPanel>
        </Container>
    );
}

export default Chat;
