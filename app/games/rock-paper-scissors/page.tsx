'use client';

import { useState, useEffect } from 'react';
import { Container, Button, Row, Col, Alert } from 'react-bootstrap';
import GameRecords from '../../../components/GameRecords';

type Choice = 'rock' | 'paper' | 'scissors';

export default function RockPaperScissors() {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<string>('');
  const [score, setScore] = useState<{ player: number; computer: number }>({ player: 0, computer: 0 });
  const [userName, setUserName] = useState<string>('');
  const [addRecord, setAddRecord] = useState<((score: string | number) => void) | null>(null);

  const handleNameSubmit = (name: string) => {
    setUserName(name);
  };

  const choices: Choice[] = ['rock', 'paper', 'scissors'];

  const getRandomChoice = (): Choice => {
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
  };

  const determineWinner = (player: Choice, computer: Choice, currentAddRecord: ((score: string | number) => void) | null) => {
    let roundResult: string;
    if (player === computer) {
      roundResult = 'It\'s a tie!';
    } else if (
      (player === 'rock' && computer === 'scissors') ||
      (player === 'paper' && computer === 'rock') ||
      (player === 'scissors' && computer === 'paper')
    ) {
      setScore(prev => ({ ...prev, player: prev.player + 1 }));
      roundResult = 'You win!';
    } else {
      setScore(prev => ({ ...prev, computer: prev.computer + 1 }));
      roundResult = 'Computer wins!';
    }

    if (currentAddRecord) {
      currentAddRecord(`${roundResult} (Player: ${score.player + (roundResult === 'You win!' ? 1 : 0)}, Computer: ${score.computer + (roundResult === 'Computer wins!' ? 1 : 0)})`);
    }
    return roundResult;
  };

  const handlePlay = (choice: Choice) => {
    setPlayerChoice(choice);
    const compChoice = getRandomChoice();
    setComputerChoice(compChoice);
    setResult(determineWinner(choice, compChoice, addRecord));
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult('');
    setScore({ player: 0, computer: 0 });
  };

  return (
    <GameRecords gameName="Rock, Paper, Scissors" onNameSubmit={handleNameSubmit}>
      {({
        userName: recordUserName,
        addRecord: recordAddRecord,
      }) => {
        useEffect(() => {
          setUserName(recordUserName);
          setAddRecord(() => recordAddRecord);
        }, [recordUserName, recordAddRecord]);

        return (
          <main>
            <Container className="mt-5 text-center">
              <h1>Rock, Paper, Scissors</h1>
              {userName && <p>Playing as: <strong>{userName}</strong></p>}
              <p className="lead">Choose your move:</p>

              <Row className="justify-content-center mb-4">
                {choices.map(choice => (
                  <Col key={choice} xs="auto" className="mx-2">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => handlePlay(choice)}
                      className="text-capitalize"
                      aria-label={`Play ${choice}`}
                    >
                      {choice}
                    </Button>
                  </Col>
                ))}
              </Row>

              {playerChoice && computerChoice && (
                <div className="mb-4" aria-live="polite" aria-atomic="true">
                  <p>You chose: <strong className="text-capitalize">{playerChoice}</strong></p>
                  <p>Computer chose: <strong className="text-capitalize">{computerChoice}</strong></p>
                  <Alert variant={result.includes('win') ? 'success' : result.includes('tie') ? 'info' : 'danger'}>
                    {result}
                  </Alert>
                </div>
              )}

              <section className="mb-4">
                <h3>Score</h3>
                <p>Player: {score.player} | Computer: {score.computer}</p>
              </section>

              <Button variant="secondary" onClick={resetGame}>Reset Score</Button>
            </Container>
          </main>
        );
      }}
    </GameRecords>
  );
}
