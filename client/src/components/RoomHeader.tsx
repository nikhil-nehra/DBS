import React, { useState, KeyboardEvent } from 'react';
import styled from 'styled-components';

interface RoomProps {
    allUsers: User[];
    currentRoom: RoomState;
}

interface RoomState {
    isChannel: boolean;
    room: Room;
    receiverID: string;
}

interface Room {
    name: string;
    host: string | null;
}

interface User {
    id: string;
    username: string;
}

function RoomHeader(props: RoomProps): JSX.Element  {

    const findUsernameById = (userId: string) => {
        const user = props.allUsers.find(user => user.id === userId);
        return user?.username || '';
    };

    return (
        <RoomInfo>
            {props.currentRoom.room.name}
            {props.currentRoom.room.host !== null && (
                <>
                    <br />
                    <span style={{ fontSize: '0.8em', color: 'grey' }}>
                        Host: {findUsernameById(props.currentRoom.room.host)}
                    </span>
                </>
            )}
        </RoomInfo>
    )
}

const RoomInfo = styled.div`
    height: 10%;
    width: 100%;
    border-bottom: 1px solid black;
`;

export default RoomHeader;