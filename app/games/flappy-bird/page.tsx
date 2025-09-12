'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Container, Button } from 'react-bootstrap';

const FlappyBirdGame = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const gameStarted = useRef(false);
  const bird = useRef({ x: 50, y: 150, width: 34, height: 24, velocity: 0 });
  const pipes = useRef<{ x: number; y: number; width: number; height: number; passed: boolean }[]>([]);
  const frame = useRef(0);
  const gameOver = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gravity = 0.5;
    const jumpStrength = -8;
    const pipeWidth = 60;
    const pipeGap = 200;

    const resetGame = () => {
      bird.current = { x: 50, y: 150, width: 34, height: 24, velocity: 0 };
      pipes.current = [];
      setScore(0);
      gameOver.current = false;
      setIsGameOver(false);
      gameStarted.current = false;
      frame.current = 0;
      gameLoop();
    };

    const drawBird = () => {
      ctx.fillStyle = '#FFD700'; // Yellow
      ctx.beginPath();
      ctx.arc(bird.current.x + bird.current.width / 2, bird.current.y + bird.current.height / 2, bird.current.width / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(bird.current.x + bird.current.width / 2 + 5, bird.current.y + bird.current.height / 2 - 5, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(bird.current.x + bird.current.width / 2 + 6, bird.current.y + bird.current.height / 2 - 4, 1.5, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawPipes = () => {
      pipes.current.forEach(pipe => {
        const topPipeGradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipe.width, 0);
        topPipeGradient.addColorStop(0, '#558B2F');
        topPipeGradient.addColorStop(1, '#8BC34A');
        ctx.fillStyle = topPipeGradient;
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.y);
        ctx.fillRect(pipe.x - 5, pipe.y - 20, pipe.width + 10, 20);

        const bottomPipeGradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipe.width, 0);
        bottomPipeGradient.addColorStop(0, '#558B2F');
        bottomPipeGradient.addColorStop(1, '#8BC34A');
        ctx.fillStyle = bottomPipeGradient;
        ctx.fillRect(pipe.x, pipe.y + pipeGap, pipe.width, canvas.height - pipe.y - pipeGap);
        ctx.fillRect(pipe.x - 5, pipe.y + pipeGap, pipe.width + 10, 20);
      });
    };

    const drawBackground = () => {
      ctx.fillStyle = '#70c5ce';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#e0f7fa';
      // Simple clouds
      ctx.beginPath();
      ctx.arc(100, 100, 30, 0, Math.PI * 2);
      ctx.arc(150, 100, 40, 0, Math.PI * 2);
      ctx.arc(200, 100, 30, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(400, 150, 40, 0, Math.PI * 2);
      ctx.arc(450, 150, 50, 0, Math.PI * 2);
      ctx.arc(500, 150, 40, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(650, 120, 30, 0, Math.PI * 2);
      ctx.arc(700, 120, 40, 0, Math.PI * 2);
      ctx.arc(750, 120, 30, 0, Math.PI * 2);
      ctx.fill();
    };

    const draw = () => {
      drawBackground();
      drawBird();
      drawPipes();

      // Draw score
      ctx.fillStyle = 'white';
      ctx.font = '36px Arial';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.strokeText(`Score: ${score}`, 10, 40);
      ctx.fillText(`Score: ${score}`, 10, 40);
    };

    const update = () => {
      if (!gameStarted.current || gameOver.current) return;

      // Bird physics
      bird.current.velocity += gravity;
      bird.current.y += bird.current.velocity;

      // Pipe generation
      if (frame.current % 100 === 0) {
        const pipeY = Math.random() * (canvas.height - pipeGap - 200) + 100;
        pipes.current.push({ x: canvas.width, y: pipeY, width: pipeWidth, height: canvas.height, passed: false });
      }

      // Move pipes
      pipes.current.forEach(pipe => {
        pipe.x -= 3;
      });

      // Remove off-screen pipes
      pipes.current = pipes.current.filter(pipe => pipe.x + pipe.width > 0);

      // Collision detection
      const birdBottom = bird.current.y + bird.current.height;
      const birdRight = bird.current.x + bird.current.width;

      if (birdBottom > canvas.height || bird.current.y < 0) {
        gameOver.current = true;
        setIsGameOver(true);
      }

      pipes.current.forEach(pipe => {
        const pipeTop = pipe.y;
        const pipeBottom = pipe.y + pipeGap;
        const pipeRight = pipe.x + pipe.width;

        if (
          birdRight > pipe.x &&
          bird.current.x < pipeRight &&
          (bird.current.y < pipeTop || birdBottom > pipeBottom)
        ) {
          gameOver.current = true;
          setIsGameOver(true);
        }

        // Update score
        if (pipe.x + pipe.width < bird.current.x && !pipe.passed) {
          setScore(prevScore => prevScore + 1);
          pipe.passed = true;
        }
      });
    };

    const gameLoop = () => {
      if (gameOver.current) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '60px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 40);
        ctx.font = '36px Arial';
        ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
        return;
      }

      update();
      draw();

      if (!gameStarted.current) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Click or Press Space to Jump', canvas.width / 2, canvas.height / 2);
      }

      frame.current++;
      requestAnimationFrame(gameLoop);
    };

    const handleJump = () => {
      if (!gameStarted.current) {
        gameStarted.current = true;
      }
      if (!gameOver.current) {
        bird.current.velocity = jumpStrength;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        handleJump();
      }
    };

    canvas.addEventListener('click', handleJump);
    window.addEventListener('keydown', handleKeyDown);

    resetGame();

    return () => {
      canvas.removeEventListener('click', handleJump);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <Container className="mt-5 text-center">
      <h1>Flappy Bird</h1>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: '1px solid black', borderRadius: '8px' }}
      ></canvas>
      {isGameOver && (
        <div className="mt-3">
          <Button onClick={() => window.location.reload()}>Restart Game</Button>
        </div>
      )}
    </Container>
  );
};

export default FlappyBirdGame;
