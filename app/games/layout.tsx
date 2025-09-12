export const metadata = {
  title: 'Fun Games - Play Word Guess, Tic-Tac-Toe, Memory, and More!',
  description: 'Explore a collection of fun and engaging online games including Word Guess, Tic-Tac-Toe, Memory Game, Number Guessing, Rock Paper Scissors, and Tile Puzzle.',
};

export default function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
