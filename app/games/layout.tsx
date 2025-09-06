export const metadata = {
  title: 'Fun Games - Play Word Guess, Tic-Tac-Toe, Memory, and More!',
  description: 'Explore a collection of fun and engaging online games including Word Guess, Tic-Tac-Toe, Memory Game, Number Guessing, Rock Paper Scissors, and Tile Puzzle.',
};

import Script from 'next/script';

export default function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script src="https://fpyf8.com/88/tag.min.js" data-zone="169079" async data-cfasync="false" strategy="beforeInteractive" />
      {children}
    </>
  );
}
