import styled from 'styled-components';

import PlayerChip from '../components/PlayerChip';
import PlayingCard from '../components/PlayingCard';

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
    const sharedCards = [
        {suit: 'Spades', rank: 'Ace'},
        {suit: 'Hearts', rank: '10'},
        {suit: 'Diamonds', rank: 'King'},
        {suit: 'Clubs', rank: 'Queen'},
        {suit: 'Spades', rank: '9'},
    ]; // Replace with actual card data

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
                    <SharedCardsContainer>
                        <PlayingCard
                            cards={sharedCards}
                        />
                    </SharedCardsContainer>
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

const SharedCardsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute; 
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); 
`;


export default GameTable;