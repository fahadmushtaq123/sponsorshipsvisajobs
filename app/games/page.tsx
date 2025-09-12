'use client';

import { Container, Button } from 'react-bootstrap';

export default function GamesList() {
  return (
    <main>
      <Container className="mt-5 text-center">
        <h1>Our Games</h1>
        <p className="lead">Choose a game to play!</p>

        <ul className="list-unstyled d-grid gap-3 col-8 mx-auto mt-4">
          <li><Button variant="outline-primary" href="/games/word-guess">Word Guess Game</Button></li>
          <li><Button variant="outline-primary" href="/games/tictactoe">Tic-Tac-Toe</Button></li>
          <li><Button variant="outline-primary" href="/games/memory">Memory Game</Button></li>
          <li><Button variant="outline-primary" href="/games/number-guessing">Number Guessing Game</Button></li>
          <li><Button variant="outline-primary" href="/games/rock-paper-scissors">Rock, Paper, Scissors</Button></li>
          <li><Button variant="outline-primary" href="/games/tile-puzzle">Tile Puzzle</Button></li>
          <li><Button variant="outline-primary" href="/games/flappy-bird">Flappy Bird</Button></li>
          <li><Button variant="outline-primary" href="/games/snake">Snake</Button></li>
          <li><Button variant="outline-primary" href="/games/minesweeper">Minesweeper</Button></li>
          <li><Button variant="outline-primary" href="/games/tetris">Tetris</Button></li>
        </ul>
      </Container>
    </main>
  );
}
