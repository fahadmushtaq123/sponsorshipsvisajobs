'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';

const TetrisGame = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 600 });

  const board = useRef<any[][]>([]);
  const player = useRef<any>({});
  const gameOver = useRef(false);
  const touchStart = useRef({ x: 0, y: 0 });

  const COLS = 10;
  const ROWS = 20;
  const [blockSize, setBlockSize] = useState(30);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const newBlockSize = screenWidth < 400 ? 20 : 30;
      setBlockSize(newBlockSize);
      setCanvasSize({ width: COLS * newBlockSize, height: ROWS * newBlockSize });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const COLORS = [
    null,
    '#FF0D72',
    '#0DC2FF',
    '#0DFF72',
    '#F538FF',
    '#FF8E0D',
    '#FFE138',
    '#3877FF',
  ];

  const SHAPES = [
    [],
    [[1, 1, 1, 1]],
    [[2, 2], [2, 2]],
    [[0, 3, 0], [3, 3, 3]],
    [[4, 4, 0], [0, 4, 4]],
    [[0, 5, 5], [5, 5, 0]],
    [[6, 0, 0], [6, 6, 6]],
    [[0, 0, 7], [7, 7, 7]],
  ];

  const resetPlayer = () => {
    const typeId = Math.floor(Math.random() * (SHAPES.length - 1)) + 1;
    const matrix = SHAPES[typeId];
    player.current = {
      pos: { x: Math.floor(COLS / 2) - Math.floor(matrix[0].length / 2), y: 0 },
      matrix: matrix,
      typeId: typeId,
    };

    if (collide(board.current, player.current)) {
      gameOver.current = true;
      setIsGameOver(true);
    }
  };

  const collide = (board: any[][], player: any) => {
    const [matrix, offset] = [player.matrix, player.pos];
    for (let y = 0; y < matrix.length; ++y) {
      for (let x = 0; x < matrix[y].length; ++x) {
        if (matrix[y][x] !== 0 && (board[y + offset.y] && board[y + offset.y][x + offset.x]) !== 0) {
          return true;
        }
      }
    }
    return false;
  };

  const createBoard = () => Array.from({ length: ROWS }, () => Array(COLS).fill(0));

  const merge = (board: any[][], player: any) => {
    player.matrix.forEach((row: any[], y: number) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          board[y + player.pos.y][x + player.pos.x] = value;
        }
      });
    });
  };

  const rotate = (matrix: any[][], dir: number) => {
    for (let y = 0; y < matrix.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
      }
    }

    if (dir > 0) {
      matrix.forEach(row => row.reverse());
    } else {
      matrix.reverse();
    }
  };

  const playerRotate = (dir: number) => {
    if (gameOver.current) return;
    const pos = player.current.pos.x;
    let offset = 1;
    rotate(player.current.matrix, dir);
    while (collide(board.current, player.current)) {
      player.current.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > player.current.matrix[0].length) {
        rotate(player.current.matrix, -dir);
        player.current.pos.x = pos;
        return;
      }
    }
  };

  const playerMove = (dir: number) => {
    if (gameOver.current) return;
    player.current.pos.x += dir;
    if (collide(board.current, player.current)) {
      player.current.pos.x -= dir;
    }
  };

  const playerDrop = () => {
    if (gameOver.current) return;
    player.current.pos.y++;
    if (collide(board.current, player.current)) {
      player.current.pos.y--;
      merge(board.current, player.current);
      resetPlayer();
      boardSweep();
    }
    dropCounter = 0;
  };

  const boardSweep = () => {
    let rowCount = 1;
    outer: for (let y = board.current.length - 1; y > 0; --y) {
      for (let x = 0; x < board.current[y].length; ++x) {
        if (board.current[y][x] === 0) {
          continue outer;
        }
      }

      const row = board.current.splice(y, 1)[0].fill(0);
      board.current.unshift(row);
      ++y;

      setScore(prevScore => prevScore + rowCount * 10);
      rowCount *= 2;
    }
  };

  let dropCounter = 0;
  let lastTime = 0;

  const update = (time = 0) => {
    if (gameOver.current) return;
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;
    if (dropCounter > 1000) {
      playerDrop();
    }
    draw();
    requestAnimationFrame(update);
  };

  const drawMatrix = (matrix: any[][], offset: { x: number, y: number }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          ctx.fillStyle = COLORS[value] || '#000';
          ctx.fillRect(x + offset.x, y + offset.y, 1, 1);
        }
      });
    });
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.scale(blockSize, blockSize);
    drawMatrix(board.current, { x: 0, y: 0 });
    drawMatrix(player.current.matrix, player.current.pos);
    ctx.restore();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (gameOver.current) return;
    if (e.key === 'ArrowLeft') {
      playerMove(-1);
    } else if (e.key === 'ArrowRight') {
      playerMove(1);
    } else if (e.key === 'ArrowDown') {
      playerDrop();
    } else if (e.key === 'q') {
      playerRotate(-1);
    } else if (e.key === 'w') {
      playerRotate(1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const touchEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    const dx = touchEnd.x - touchStart.current.x;
    const dy = touchEnd.y - touchStart.current.y;

    if (Math.abs(dx) > Math.abs(dy)) { // Horizontal swipe
      if (dx > 0) {
        playerMove(1);
      } else {
        playerMove(-1);
      }
    } else { // Vertical swipe
      if (dy > 0) {
        playerDrop();
      } else {
        playerRotate(1); // Rotate on swipe up
      }
    }
  };

  useEffect(() => {
    board.current = createBoard();
    resetPlayer();
    update();
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [canvasSize]);

  return (
    <Container className="mt-5 text-center">
      <h1>Tetris</h1>
      <p>Use arrow keys or touch controls to play.</p>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        style={{ border: '1px solid black', maxWidth: '100%' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      ></canvas>
      <div className="mt-3">
        <h2>Score: {score}</h2>
      </div>
      <Row className="mt-3">
        <Col>
          <Button onClick={() => playerRotate(-1)}>Rotate Left</Button>
        </Col>
        <Col>
          <Button onClick={() => playerRotate(1)}>Rotate Right</Button>
        </Col>
        <Col>
          <Button onClick={playerDrop}>Drop</Button>
        </Col>
      </Row>
      {isGameOver && (
        <div className="mt-3">
          <h3>Game Over</h3>
          <Button onClick={() => window.location.reload()}>New Game</Button>
        </div>
      )}
    </Container>
  );
};

export default TetrisGame;
