export const metadata = {
  title: 'Fun Games - Play Word Guess, Tic-Tac-Toe, Memory, and More!',
  description: 'Explore a collection of fun and engaging online games including Word Guess, Tic-Tac-Toe, Memory Game, Number Guessing, Rock Paper Scissors, and Tile Puzzle.',
};

import { useContext } from 'react';
import Script from 'next/script';
import { AuthContext } from '../../context/AuthContext';

export default function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authContext = useContext(AuthContext);
  const isAdmin = authContext?.isAdmin;

  return (
    <>
      {!isAdmin && (
        <Script src="https://fpyf8.com/88/tag.min.js" data-zone="169079" async data-cfasync="false" strategy="beforeInteractive" />
      )}
      {children}
    </>
  );
}
