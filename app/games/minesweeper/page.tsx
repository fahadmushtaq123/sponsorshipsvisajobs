'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Container, Button, Form } from 'react-bootstrap';

const MinesweeperGame = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameMode, setGameMode] = useState('medium');
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [mineCount, setMineCount] = useState(0);
  const [mode, setMode] = useState('reveal'); // reveal or flag

  const grid = useRef<any[]>([]);
  const gameOver = useRef(false);

  const gameSettings = {
    easy: { rows: 10, cols: 10, mines: 10 },
    medium: { rows: 16, cols: 16, mines: 40 },
    hard: { rows: 16, cols: 30, mines: 99 },
  };

  const setupGrid = () => {
    const { rows, cols, mines } = gameSettings[gameMode as keyof typeof gameSettings];
    setMineCount(mines);
    gameOver.current = false;
    setIsGameOver(false);
    setGameWon(false);

    // Initialize grid
    grid.current = Array(rows).fill(null).map(() => Array(cols).fill(null).map(() => ({ isMine: false, isRevealed: false, isFlagged: false, adjacentMines: 0 })));

    // Place mines
    let minesPlaced = 0;
    while (minesPlaced < mines) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      if (!grid.current[row][col].isMine) {
        grid.current[row][col].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate adjacent mines
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid.current[r][c].isMine) continue;
        let count = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const newRow = r + i;
            const newCol = c + j;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && grid.current[newRow][newCol].isMine) {
              count++;
            }
          }
        }
        grid.current[r][c].adjacentMines = count;
      }
    }
    draw();
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { rows, cols } = gameSettings[gameMode as keyof typeof gameSettings];
    const cellSize = canvas.width / cols;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = grid.current[r][c];
        ctx.strokeStyle = '#999';
        ctx.strokeRect(c * cellSize, r * cellSize, cellSize, cellSize);

        if (cell.isRevealed) {
          if (cell.isMine) {
            ctx.fillStyle = 'red';
            ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
          } else {
            ctx.fillStyle = '#ddd';
            ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
            if (cell.adjacentMines > 0) {
              ctx.fillStyle = 'black';
              ctx.font = `${cellSize * 0.6}px Arial`;
              ctx.textAlign = 'center';
              ctx.fillText(cell.adjacentMines.toString(), c * cellSize + cellSize / 2, r * cellSize + cellSize / 1.5);
            }
          }
        } else {
          ctx.fillStyle = '#bbb';
          ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
          if (cell.isFlagged) {
            ctx.fillStyle = 'blue';
            ctx.font = `${cellSize * 0.8}px Arial`;
            ctx.textAlign = 'center';
            ctx.fillText('P', c * cellSize + cellSize / 2, r * cellSize + cellSize / 1.5);
          }
        }
      }
    }
  };

  const revealCell = (row: number, col: number) => {
    const { rows, cols } = gameSettings[gameMode as keyof typeof gameSettings];
    if (row < 0 || row >= rows || col < 0 || col >= cols || grid.current[row][col].isRevealed || grid.current[row][col].isFlagged) {
      return;
    }

    grid.current[row][col].isRevealed = true;

    if (grid.current[row][col].isMine) {
      gameOver.current = true;
      setIsGameOver(true);
      return;
    }

    if (grid.current[row][col].adjacentMines === 0) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          revealCell(row + i, col + j);
        }
      }
    }
    checkWinCondition();
  };

  const checkWinCondition = () => {
    const { rows, cols, mines } = gameSettings[gameMode as keyof typeof gameSettings];
    let revealedCount = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid.current[r][c].isRevealed) {
          revealedCount++;
        }
      }
    }
    if (revealedCount === rows * cols - mines) {
      setGameWon(true);
      gameOver.current = true;
      setIsGameOver(true);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameOver.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { cols } = gameSettings[gameMode as keyof typeof gameSettings];
    const cellSize = canvas.width / cols;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / (canvas.height / gameSettings[gameMode as keyof typeof gameSettings].rows));

    if (mode === 'reveal') {
      revealCell(row, col);
    } else {
      grid.current[row][col].isFlagged = !grid.current[row][col].isFlagged;
    }
    draw();
  };

  useEffect(() => {
    setupGrid();
  }, [gameMode]);

  return (
    <Container className="mt-5 text-center">
      <h1>Minesweeper</h1>
      <p>Left-click or tap to reveal. Use the toggle to switch to flag mode.</p>
      <Form.Group className="mb-3">
        <Form.Label>Select Difficulty</Form.Label>
        <Form.Control as="select" value={gameMode} onChange={(e) => setGameMode(e.target.value)}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </Form.Control>
      </Form.Group>
      <Button className="mb-3" onClick={() => setMode(mode === 'reveal' ? 'flag' : 'reveal')}>
        Mode: {mode === 'reveal' ? 'Reveal' : 'Flag'}
      </Button>
      <canvas
        ref={canvasRef}
        width={gameSettings[gameMode as keyof typeof gameSettings].cols * 30}
        height={gameSettings[gameMode as keyof typeof gameSettings].rows * 30}
        style={{ border: '1px solid black', backgroundColor: '#f0f0f0' }}
        onClick={handleCanvasClick}
        onContextMenu={(e) => e.preventDefault()} // Prevent context menu on right click
      ></canvas>
      <div className="mt-3">
        <h2>Mines: {mineCount}</h2>
      </div>
      {(isGameOver || gameWon) && (
        <div className="mt-3">
          <h3>{gameWon ? 'You Win!' : 'Game Over'}</h3>
          <Button onClick={setupGrid}>New Game</Button>
        </div>
      )}
    </Container>
  );
};

export default MinesweeperGame;