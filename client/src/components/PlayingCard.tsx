import styled from 'styled-components';

interface PlayingCardProps {
    cards: Card[]
}

interface Card {
    suit: string;
    rank: string;
}

function PlayingCard(props: PlayingCardProps): JSX.Element  {

    return (
        <>
            {props.cards.map((card, index) => (
                <CardIcon key={index}>{card.suit}: {card.rank}</CardIcon>
            ))}
        </>
    )
}

const CardIcon = styled.div`
  width: 50px;
  height: 70px;
  background-color: #f8f9fa;
  border-radius: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 12px;
  margin-right: 10px;
  margin-bottom: 10px;
`;

export default PlayingCard;