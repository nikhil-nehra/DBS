import styled from 'styled-components';

interface PlayerChipProps {
    players: User[]
}

interface User {
    id: string;
    username: string;
}

function PlayerChip(props: PlayerChipProps): JSX.Element  {

    return (
        <>
            {props.players.map((player, index) => (
                <PlayerIcon key={index}>{player.username}</PlayerIcon>
            ))}
        </>
    )
}

const PlayerIcon = styled.div`
  width: 50px;
  height: 50px;
  background-color: #f8f9fa;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 12px;
`;

export default PlayerChip;