'use client';

import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import GameRecords from '../../../components/GameRecords';

const wordList = [
  "APPLE", "BAKER", "CANDY", "DREAM", "EAGLE", "FLAME", "GRAPE", "HOUSE", "IGLOO", "JOKER",
  "KNIFE", "LEMON", "MANGO", "NIGHT", "OCEAN", "PIANO", "QUEEN", "RIVER", "SNAKE", "TABLE",
  "UMBRELLA", "VIOLIN", "WATER", "XYLOPHONE", "YACHT", "ZEBRA", "ABACUS", "BALLOON", "CAMERA", "DAISY",
  "ELEPHANT", "FINGER", "GUITAR", "HAMMER", "ICEBERG", "JACKET", "KANGAROO", "LANTERN", "MOUNTAIN", "NECKLACE",
  "ORANGE", "PENCIL", "QUILT", "RABBIT", "SUNSHINE", "TIGER", "UNICORN", "VOLCANO", "WINDOW", "XENON",
  "YOGURT", "ZODIAC", "ACORN", "BUTTERFLY", "CASTLE", "DOLPHIN", "ENGINE", "FOREST", "GALAXY", "HARMONY",
  "ISLAND", "JEWEL", "KETTLE", "LAGOON", "MIRROR", "NECTAR", "OSTRICH", "PARROT", "QUASAR", "RAINBOW",
  "STARFISH", "TURTLE", "UNIVERSE", "VIOLET", "WHALE", "XEROX", "YARD", "ZIGZAG", "ALMOND", "BLOSSOM",
  "CARROT", "DIAMOND", "ECLIPSE", "FEATHER", "GIRAFFE", "HAWK", "INKWELL", "JASMINE", "KEYBOARD", "LAVENDER",
  "MAGNET", "NOODLE", "OLIVE", "PEACOCK", "QUIVER", "ROSEBUD", "SPARROW", "TULIP", "URANIUM", "VELVET",
  "WIZARD", "XENIA", "YARN", "ZIRCON", "ANTELOPE", "BAMBOO", "COCONUT", "DRAGON", "EMERALD", "FLAMINGO",
  "GOLDFISH", "HONEYCOMB", "IVORY", "JAGUAR", "KOALA", "LIZARD", "MARIGOLD", "NARCISSUS", "ORCHID", "PENGUIN",
  "QUARTZ", "RHINOCEROS", "SEAGULL", "TOUCAN", "URSA", "VULTURE", "WALRUS", "XENODOCIAL", "YAK", "ZINNIA"
];

export default function WordGuessGame() {
  const [wordToGuess, setWordToGuess] = useState<string>('');
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const maxIncorrectGuesses = 6;
  const [userName, setUserName] = useState<string>('');
  const [addRecord, setAddRecord] = useState<((score: string | number) => void) | null>(null);

  const handleNameSubmit = (name: string) => {
    setUserName(name);
  };

  useEffect(() => {
    if (gameStatus !== 'playing' && addRecord) {
      if (gameStatus === 'won') {
        addRecord(`Guessed in ${incorrectGuesses} incorrect guesses`);
      } else if (gameStatus === 'lost') {
        addRecord(`Failed to guess`);
      }
    }
  }, [gameStatus, addRecord, incorrectGuesses]);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    setWordToGuess(wordList[randomIndex].toUpperCase());
    setGuessedLetters([]);
    setIncorrectGuesses(0);
    setGameStatus('playing');
  };

  const displayWord = wordToGuess
    .split('')
    .map(letter => (guessedLetters.includes(letter) ? letter : '_'))
    .join(' ');

  const handleGuess = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (gameStatus !== 'playing') return;

    const form = e.currentTarget;
    const input = form.elements.namedItem('letterGuess') as HTMLInputElement;
    const guess = input.value.toUpperCase();
    input.value = '';

    if (guess.length !== 1 || !/^[A-Z]$/.test(guess)) {
      alert('Please enter a single letter.');
      return;
    }

    if (guessedLetters.includes(guess)) {
      alert('You already guessed that letter!');
      return;
    }

    setGuessedLetters(prev => [...prev, guess]);

    if (!wordToGuess.includes(guess)) {
      setIncorrectGuesses(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (gameStatus !== 'playing') return;

    if (incorrectGuesses >= maxIncorrectGuesses) {
      setGameStatus('lost');
    } else if (displayWord.replace(/ /g, '') === wordToGuess) {
      setGameStatus('won');
    }
  }, [incorrectGuesses, displayWord, wordToGuess, gameStatus]);

  return (
    <GameRecords gameName="Word Guess Game" onNameSubmit={handleNameSubmit}>
      {({ userName: recordUserName, addRecord: recordAddRecord }) => {
        useEffect(() => {
          setAddRecord(() => recordAddRecord);
        }, [recordAddRecord]);

        return (
          <main>
            <Container className="mt-5 text-center">
              <h1>Word Guess Game</h1>
              {userName && <p>Playing as: <strong>{userName}</strong></p>}
              <p className="lead">Guess the word!</p>

              <div className="my-4">
                <h2>{displayWord}</h2>
              </div>

              <p>Incorrect Guesses: {incorrectGuesses} / {maxIncorrectGuesses}</p>
              <p>Guessed Letters: {guessedLetters.join(', ')}</p>

              {gameStatus === 'playing' && (
                <Form onSubmit={handleGuess} className="my-3">
                  <Row className="justify-content-center">
                    <Col xs="auto">
                      <Form.Control
                        type="text"
                        maxLength={1}
                        name="letterGuess"
                        placeholder="Enter a letter"
                        className="text-center"
                        aria-label="Enter your letter guess"
                      />
                    </Col>
                    <Col xs="auto">
                      <Button variant="primary" type="submit">Guess</Button>
                    </Col>
                  </Row>
                </Form>
              )}

              <div aria-live="polite" aria-atomic="true">
                {gameStatus === 'won' && (
                  <div className="my-3">
                    <h3>Congratulations! You guessed the word!</h3>
                    <Button variant="success" onClick={startNewGame}>Play Again</Button>
                  </div>
                )}

                {gameStatus === 'lost' && (
                  <div className="my-3">
                    <h3>Game Over! The word was: {wordToGuess}</h3>
                    <Button variant="danger" onClick={startNewGame}>Play Again</Button>
                  </div>
                )}
              </div>

              {gameStatus !== 'playing' && (
                <Button variant="secondary" onClick={startNewGame} className="mt-3">New Game</Button>
              )}
            </Container>
          </main>
        );
      }}
    </GameRecords>
  );
}
