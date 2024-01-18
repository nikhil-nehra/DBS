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

interface SidebarProps {
  allRooms: Room[];
  allUsers: User[];
  yourID: string;
  createRoom: (roomName: string, hostName: string) => void;
  sendMessage: () => void;
  toggleChat: (chat: ChatState) => void;
}

interface ChatState {
    isChannel: boolean;
    chat: Room;
    receiverID: string;
}

const SidebarContainer = styled.div`
  height: 100%;
  width: 10%;
  border-right: 1px solid black;
`;

const Row = styled.div`
  cursor: pointer;
`;

const RoomNameBox = styled.input`
    height: 15px;
    width: 100%;
    padding: 5px;
    box-sizing: border-box;
`;

function Sidebar(props: SidebarProps): JSX.Element {
    const [isCreatingRoom, setIsCreatingRoom] = useState(false);
    const [newRoomName, setNewRoomName] = useState('');

    
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

    return (
        <SidebarContainer>
        <h3>Channels</h3>
        {props.allRooms.map(renderRooms)}
        {handleCreateRoomUI()}
        <h3>All Users</h3>
        {props.allUsers.map(renderUsers)}
        </SidebarContainer>
    );
}

export default Sidebar;