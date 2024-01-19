import styled from 'styled-components';

import PlayerChip from '../components/PlayerChip';

interface GameProps {
    currentRoom: RoomState;
    connectedRooms: Room[];
    allUsers: User[];
}

interface User {
    id: string;
    username: string;
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
    const playerNames = ['Nikhil', 'P2', 'P3', 'P4']; // Replace with actual player data

    let gameBody;
    if (!props.currentRoom.isChannel || props.connectedRooms.some(room => room.name === props.currentRoom.room.name)) {
        gameBody = (
            <PokerTableContainer>
                <Table>
                    <TableFelt/>
                    <PlayerIconsContainer>
                        <PlayerChip
                            players={props.allUsers}
                        />
                    </PlayerIconsContainer>
                </Table>
            </PokerTableContainer>
        );
    } else {
        gameBody = (
            <>Your not connected to this room!</>
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

const PokerTableContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Table = styled.div`
  width: 800px;
  height: 400px;
  background-color: #0c4b33;
  border-radius: 20px;
  position: relative;
`;

const TableFelt = styled.div`
  width: 100%;
  height: 100%;
  background-color: #009688;
  border-radius: 15px;
`;

const PlayerIconsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  position: absolute;
  bottom: 10px;
  width: 100%;
`;

export default GameTable;