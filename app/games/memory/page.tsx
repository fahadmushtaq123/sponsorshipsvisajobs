'use client';

import { useState, useEffect } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import GameRecords from '../../../components/GameRecords';

const cardImages = [
  '🍎', '🍌', '🍒', '🍇', '🍋', '🍊',
  '🍓', '🍉', '🥝', '🍍', '🥭', '🍑'
];

interface Card {
  id: number;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchesFound, setMatchesFound] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [addRecord, setAddRecord] = useState<((score: string | number) => void) | null>(null);

  const handleNameSubmit = (name: string) => {
    setUserName(name);
  };

  useEffect(() => {
    if (gameStarted) {
      initializeGame();
    }
  }, [gameStarted]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstIndex, secondIndex] = flippedCards;
      if (cards[firstIndex].image === cards[secondIndex].image) {
        // Match found
        setCards(prevCards =>
          prevCards.map((card, index) =>
            index === firstIndex || index === secondIndex
              ? { ...card, isMatched: true }
              : card
          )
        );
        setMatchesFound(prev => prev + 1);
      }

      // Flip back after a short delay
      setTimeout(() => {
        setCards(prevCards =>
          prevCards.map((card, index) =>
            index === firstIndex || index === secondIndex
              ? { ...card, isFlipped: card.isMatched } // Keep matched cards flipped
              : { ...card, isFlipped: false } // Flip back non-matched cards
          )
        );
        setFlippedCards([]);
      }, 1000);
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (gameStarted && matchesFound === cardImages.length && addRecord) {
      alert(`Congratulations! You won in ${moves} moves!`);
      addRecord(`${moves} moves`);
      setGameStarted(false); // End game
    }
  }, [matchesFound, moves, gameStarted, addRecord]);

  const initializeGame = () => {
    setMoves(0);
    setMatchesFound(0);
    setFlippedCards([]);

    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((image, index) => ({
        id: index,
        image,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledCards);
  };

  const handleCardClick = (index: number) => {
    if (!gameStarted || flippedCards.length === 2 || cards[index].isFlipped || cards[index].isMatched) {
      return;
    }

    setCards(prevCards =>
      prevCards.map((card, i) =>
        i === index ? { ...card, isFlipped: true } : card
      )
    );
    setFlippedCards(prev => [...prev, index]);
    setMoves(prev => prev + 1);
  };

  return (
    <GameRecords gameName="Memory Game" onNameSubmit={handleNameSubmit}>
      {({ userName: recordUserName, addRecord: recordAddRecord }) => {
        useEffect(() => {
          setUserName(recordUserName);
          setAddRecord(() => recordAddRecord);
        }, [recordUserName, recordAddRecord]);

        return (
          <main>
            <Container className="mt-5 text-center">
              <h1>Memory Game</h1>
              {userName && <p>Playing as: <strong>{userName}</strong></p>}
              {!gameStarted ? (
                <Button onClick={() => setGameStarted(true)}>Start Game</Button>
              ) : (
                <>
                  <p>Moves: {moves} | Matches: {matchesFound} / {cardImages.length}</p>
                  <div
                    role="grid"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(6, 1fr)',
                      gap: '10px',
                      maxWidth: '600px',
                      margin: '0 auto',
                    }}
                  >
                    {cards.map((card, index) => (
                      <div
                        key={card.id}
                        onClick={() => handleCardClick(index)}
                        style={{
                          width: '80px',
                          height: '80px',
                          backgroundColor: card.isFlipped || card.isMatched ? '#f8f9fa' : '#6c757d',
                          border: '1px solid #dee2e6',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          fontSize: '2rem',
                          cursor: card.isFlipped || card.isMatched ? 'default' : 'pointer',
                          borderRadius: '5px',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                        }}
                        role="button"
                        aria-label={card.isFlipped ? `Card showing ${card.image}` : `Hidden card`}
                      >
                        {card.isFlipped || card.isMatched ? card.image : ''}
                      </div>
                    ))}
                  </div>
                  <Button onClick={initializeGame} className="mt-4">Reset Game</Button>
                </>
              )}
            </Container>
          </main>
        );
      }}
    </GameRecords>
  );
}
