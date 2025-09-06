'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Container, Button } from 'react-bootstrap';

const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const snake = useRef([{ x: 200, y: 200 }]);
  const direction = useRef({ x: 0, y: -20 }); // Start moving up
  const food = useRef({ x: 0, y: 0 });
  const gameOver = useRef(false);
  const touchStart = useRef({ x: 0, y: 0 });

  const generateFood = () => {
    food.current = {
      x: Math.floor(Math.random() * 20) * 20,
      y: Math.floor(Math.random() * 20) * 20,
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gridSize = 20;

    const resetGame = () => {
      snake.current = [{ x: 200, y: 200 }];
      direction.current = { x: 0, y: -20 };
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

        // Draw food
        ctx.fillStyle = 'red';
        ctx.fillRect(food.current.x, food.current.y, gridSize, gridSize);

        // Move snake
        const head = { x: snake.current[0].x + direction.current.x, y: snake.current[0].y + direction.current.y };
        snake.current.unshift(head);

        // Check if snake ate food
        if (head.x === food.current.x && head.y === food.current.y) {
          setScore(prevScore => prevScore + 1);
          generateFood();
        } else {
          snake.current.pop();
        }

        // Check for collision
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

        // Draw snake
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

      if (Math.abs(dx) > Math.abs(dy)) { // Horizontal swipe
        if (dx > 0) { // Right
          if (direction.current.x === 0) direction.current = { x: gridSize, y: 0 };
        } else { // Left
          if (direction.current.x === 0) direction.current = { x: -gridSize, y: 0 };
        }
      } else { // Vertical swipe
        if (dy > 0) { // Down
          if (direction.current.y === 0) direction.current = { x: 0, y: gridSize };
        } else { // Up
          if (direction.current.y === 0) direction.current = { x: 0, y: -gridSize };
        }
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
  }, []);

  return (
    <Container className="mt-5 text-center">
      <h1>Snake</h1>
      <p>Use the arrow keys or swipe to control the snake.</p>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        style={{ border: '1px solid black', backgroundColor: '#f0f0f0' }}
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