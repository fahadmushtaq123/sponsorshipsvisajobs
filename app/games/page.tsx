'use client';

import { Container, Button } from 'react-bootstrap';
import Script from 'next/script';

const AdComponent = () => {
  return (
    <div className="my-3">
      <Script
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6708928200370482"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <ins className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-format="fluid"
          data-ad-layout-key="-gw-3+1f-3d+2z"
          data-ad-client="ca-pub-6708928200370482"
          data-ad-slot="5102444283"></ins>
      <Script
        id="adsbygoogle-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(adsbygoogle = window.adsbygoogle || []).push({});`,
        }}
      />
    </div>
  );
};

const games = [
  { name: 'Word Guess Game', href: '/games/word-guess' },
  { name: 'Tic-Tac-Toe', href: '/games/tictactoe' },
  { name: 'Memory Game', href: '/games/memory' },
  { name: 'Number Guessing Game', href: '/games/number-guessing' },
  { name: 'Rock, Paper, Scissors', href: '/games/rock-paper-scissors' },
  { name: 'Tile Puzzle', href: '/games/tile-puzzle' },
  { name: 'Flappy Bird', href: '/games/flappy-bird', target: '_blank' },
  { name: 'Snake', href: '/games/snake' },
  { name: 'Minesweeper', href: '/games/minesweeper' },
  { name: 'Tetris', href: '/games/tetris' },
];

export default function GamesList() {
  return (
    <main>
      <Container className="mt-5 text-center">
        <h1>Our Games</h1>
        <p className="lead">Choose a game to play!</p>

        <div className="d-grid gap-3 col-8 mx-auto mt-4">
          {games.flatMap((game, index) => {
            const gameButton = (
              <Button key={game.href} variant="outline-primary" href={game.href} target={game.target}>
                {game.name}
              </Button>
            );
            return [gameButton, <AdComponent key={`ad-${index}`} />];
          })}
        </div>
      </Container>
    </main>
  );
}