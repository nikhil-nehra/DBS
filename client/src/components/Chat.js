import React, { useState } from 'react';
import styled from 'styled-components'

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


function Chat(props) {
    const [isCreatingRoom, setIsCreatingRoom] = useState(false);
    const [newRoomName, setNewRoomName] = useState('');


    function renderRooms(room) {
        const currentChat = {
            chatName: room,
            isChannel: true,
            receiverID: '',
        };
        return (
            <Row onClick={() => props.toggleChat(currentChat)} key={room}>
                {room}
            </Row>
        );
    }

    function renderUsers(user) {
        if (user.id === props.yourID) {
            return (
                <Row key={user.id}>
                    You: {user.username}
                </Row>
            );
        }
        const currentChat = {
            chatName: user.username,
            isChannel: false,
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

    function renderMessages(message, index) {
        return (
            <div key={index}>
                <h3>{message.sender}</h3>
                <p>{message.content}</p>
            </div>
        );
    }

    let body;
    if (!props.currentChat.isChannel || props.connectedRooms.includes(props.currentChat.chatName)) {
        body = (
            <Messages>
                {props.messages.map(renderMessages)}
            </Messages>
        );
    } else {
        body = (
            <button onClick={() => props.joinRoom(props.currentChat.chatName)}>Join {props.currentChat.chatName}</button>
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
            props.createRoom(newRoomName);
            setIsCreatingRoom(false);
            setNewRoomName('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (isCreatingRoom) {
                handleCreateRoom();
            } else {
                props.sendMessage();
            }
        }
    };

    function CreateRoomUI({ newRoomName, setNewRoomName, handleKeyPress, handleCreateRoom }) {
        return (
            <>
                <RoomNameBox
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    onKeyUp={handleKeyPress}
                    placeholder='Enter room name'
                />
                <button onClick={handleCreateRoomCancel}>Cancel</button>
            </>
        );
    }

    const handleCreateRoomUI = () => {
        if (isCreatingRoom) {
            return (
                <CreateRoomUI
                    newRoomName={newRoomName}
                    setNewRoomName={setNewRoomName}
                    handleKeyPress={handleKeyPress}
                    handleCreateRoom={handleCreateRoom}
                />
            );
        } else {
            return <button onClick={handleCreateRoomClick}>Create Room</button>;
        }
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
                {props.currentChat.chatName}
            </ChannelInfo>
            <BodyContainer>
                {body}
            </BodyContainer>
            <TextBox
                value={props.message}
                onChange={props.handleMessageChange}
                onKeyUp ={handleKeyPress}
                placeholder='say something'
            />
        </ChatPanel>
      </Container>
    );
}

export default Chat;