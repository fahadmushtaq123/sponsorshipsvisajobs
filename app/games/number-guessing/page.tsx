'use client';

import { useState, useEffect } from 'react';
import { Container, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import GameRecords from '../../../components/GameRecords';

export default function NumberGuessingGame() {
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [guess, setGuess] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [addRecord, setAddRecord] = useState<((score: string | number) => void) | null>(null);

  const handleNameSubmit = (name: string) => {
    setUserName(name);
  };

  useEffect(() => {
    if (gameStarted) {
      startNewGame();
    }
  }, [gameStarted]);

  const startNewGame = () => {
    const newTarget = Math.floor(Math.random() * 100) + 1; // Number between 1 and 100
    setTargetNumber(newTarget);
    setGuess('');
    setMessage('Guess a number between 1 and 100.');
    setAttempts(0);
    setGameStarted(true);
  };

  const handleGuessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuess(e.target.value);
  };

  const handleSubmitGuess = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsedGuess = parseInt(guess);

    if (isNaN(parsedGuess) || parsedGuess < 1 || parsedGuess > 100) {
      setMessage('Please enter a valid number between 1 and 100.');
      return;
    }

    setAttempts(prev => prev + 1);

    if (parsedGuess === targetNumber) {
      setMessage(`Congratulations! You guessed the number ${targetNumber} in ${attempts + 1} attempts!`);
      setGameStarted(false);
      if (addRecord) {
        addRecord(`${attempts + 1} attempts`);
      }
    } else if (parsedGuess < targetNumber) {
      setMessage('Too low! Try again.');
    } else {
      setMessage('Too high! Try again.');
    }
    setGuess(''); // Clear input after guess
  };

  return (
    <GameRecords gameName="Number Guessing Game" onNameSubmit={handleNameSubmit}>
      {({ userName: recordUserName, addRecord: recordAddRecord }) => {
        useEffect(() => {
          setAddRecord(() => recordAddRecord);
        }, [recordAddRecord]);

        return (
          <main>
            <Container className="mt-5 text-center">
              <h1>Number Guessing Game</h1>
              {userName && <p>Playing as: <strong>{userName}</strong></p>}
              {!gameStarted ? (
                <Button onClick={startNewGame}>Start Game</Button>
              ) : (
                <>
                  <Alert variant="info" aria-live="polite" aria-atomic="true">{message}</Alert>
                  <p>Attempts: {attempts}</p>
                  <Form onSubmit={handleSubmitGuess} className="my-3">
                    <Row className="justify-content-center">
                      <Col xs={6} md={4} lg={3}>
                        <Form.Group controlId="numberGuessInput">
                          <Form.Label className="visually-hidden">Enter your guess</Form.Label>
                          <Form.Control
                            type="number"
                            value={guess}
                            onChange={handleGuessChange}
                            placeholder="Enter your guess"
                            min="1"
                            max="100"
                            required
                            className="text-center"
                          />
                        </Form.Group>
                      </Col>
                      <Col xs="auto">
                        <Button variant="primary" type="submit">Guess</Button>
                      </Col>
                    </Row>
                  </Form>
                  <Button variant="secondary" onClick={startNewGame} className="mt-3">New Game</Button>
                </>
              )}
            </Container>
          </main>
        );
      }}
    </GameRecords>
  );
}
