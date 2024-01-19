import React, { useState, KeyboardEvent } from 'react';
import styled from 'styled-components';

interface GameProps {
    currentRoom: RoomState;
    connectedRooms: Room[];
}

interface Room {
    name: string;
    host: string | null;
}

interface RoomState {
    isChannel: boolean;
    room: Room;
    receiverID: string;
}

function GameTable(props: GameProps): JSX.Element  {
    let gameBody;
    if (!props.currentRoom.isChannel || props.connectedRooms.some(room => room.name === props.currentRoom.room.name)) {
        gameBody = (
            <>
            Gaming Time
            </>
        );
    } else {
        gameBody = (
            <>Join Gaming Time</>
        );
    }

    return (
        <GamePanel>
            {gameBody}
        </GamePanel>
    )
}

const GamePanel = styled.div`
    width: 100%;
    height: 100%;
    overflow: scroll;
    border-bottom: 1px solid black;
    flex: 1;
`;

export default GameTable;