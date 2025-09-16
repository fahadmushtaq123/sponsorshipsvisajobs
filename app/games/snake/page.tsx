'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Container, Button } from 'react-bootstrap';

const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 400 });

  const snake = useRef([{ x: 200, y: 200 }]);
  const direction = useRef({ x: 0, y: -20 }); // Start moving up
  const food = useRef({ x: 0, y: 0 });
  const gameOver = useRef(false);
  const touchStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleResize = () => {
      const size = Math.min(window.innerWidth - 20, 400);
      setCanvasSize({ width: size, height: size });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const generateFood = () => {
    const gridSize = 20;
    food.current = {
      x: Math.floor(Math.random() * (canvasSize.width / gridSize)) * gridSize,
      y: Math.floor(Math.random() * (canvasSize.height / gridSize)) * gridSize,
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gridSize = 20;

    const resetGame = () => {
      const startX = Math.floor(canvasSize.width / 2 / gridSize) * gridSize;
      const startY = Math.floor(canvasSize.height / 2 / gridSize) * gridSize;
      snake.current = [{ x: startX, y: startY }];
      direction.current = { x: 0, y: -gridSize };
      generateFood();
      setScore(0);
      gameOver.current = false;
      setIsGameOver(false);
      main();
    };

    const main = () => {
      if (gameOver.current) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 40);
        ctx.font = '24px Arial';
        ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
        return;
      }

      setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'red';
        ctx.fillRect(food.current.x, food.current.y, gridSize, gridSize);

        const head = { x: snake.current[0].x + direction.current.x, y: snake.current[0].y + direction.current.y };
        snake.current.unshift(head);

        if (head.x === food.current.x && head.y === food.current.y) {
          setScore(prevScore => prevScore + 1);
          generateFood();
        } else {
          snake.current.pop();
        }

        if (
          head.x < 0 ||
          head.x >= canvas.width ||
          head.y < 0 ||
          head.y >= canvas.height ||
          snake.current.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
        ) {
          gameOver.current = true;
          setIsGameOver(true);
        }

        ctx.fillStyle = 'green';
        snake.current.forEach(segment => {
          ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
        });

        main();
      }, 100);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.current.y === 0) direction.current = { x: 0, y: -gridSize };
          break;
        case 'ArrowDown':
          if (direction.current.y === 0) direction.current = { x: 0, y: gridSize };
          break;
        case 'ArrowLeft':
          if (direction.current.x === 0) direction.current = { x: -gridSize, y: 0 };
          break;
        case 'ArrowRight':
          if (direction.current.x === 0) direction.current = { x: gridSize, y: 0 };
          break;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
      const dx = touchEnd.x - touchStart.current.x;
      const dy = touchEnd.y - touchStart.current.y;

      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0 && direction.current.x === 0) direction.current = { x: gridSize, y: 0 };
        else if (dx < 0 && direction.current.x === 0) direction.current = { x: -gridSize, y: 0 };
      } else {
        if (dy > 0 && direction.current.y === 0) direction.current = { x: 0, y: gridSize };
        else if (dy < 0 && direction.current.y === 0) direction.current = { x: 0, y: -gridSize };
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchend', handleTouchEnd);

    resetGame();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [canvasSize, score]);

  return (
    <Container className="mt-5 text-center">
      <h1>Snake</h1>
      <p>Use the arrow keys or swipe to control the snake.</p>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        style={{ border: '1px solid black', backgroundColor: '#f0f0f0', maxWidth: '100%' }}
      ></canvas>
      <div className="mt-3">
        <h2>Score: {score}</h2>
      </div>
      {isGameOver && (
        <div className="mt-3">
          <Button onClick={() => window.location.reload()}>Restart Game</Button>
        </div>
      )}
    </Container>
  );
};

export default SnakeGame;
