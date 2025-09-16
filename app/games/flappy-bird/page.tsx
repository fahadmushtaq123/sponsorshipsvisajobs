'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import Image from 'next/image';

const FlappyBirdGame = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [topScores, setTopScores] = useState<{ name: string, score: number }[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [showVideo, setShowVideo] = useState(true);
  const scoreRef = useRef(score);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let bird = { x: 50, y: 150, width: 34, height: 24, velocity: 0 };
    let pipes: { x: number, y: number, width: number, height: number, passed: boolean }[] = [];
    let frame = 0;
    let gameOver = false;
    let isSuperPowerActive = false;
    let superPowerTimer = 0;
    let superPowerItem: { x: number, y: number, width: number, height: number } | null = null;
    let bullets: { x: number, y: number, width: number, height: number }[] = [];

    const gravity = 0.4;
    const jumpStrength = -8;
    const pipeWidth = 50;
    const pipeGap = 200;
    let pipeSpeed = 2;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      pipeSpeed = canvas.width / 400;
    };

    const saveScore = async () => {
      const name = prompt("Enter your name to save your score:");
      if (name) {
        await fetch('/api/flappy-bird-scores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, score: scoreRef.current }),
        });
      }
    };

    const fetchTopScores = async () => {
      const response = await fetch('/api/flappy-bird-scores');
      const data = await response.json();
      setTopScores(data);
    };

    const resetGame = () => {
      bird = { x: 50, y: 150, width: 34, height: 24, velocity: 0 };
      pipes = [];
      setScore(0);
      gameOver = false;
      setIsGameOver(false);
      frame = 0;
      setTopScores([]);
      isSuperPowerActive = false;
      superPowerTimer = 0;
      superPowerItem = null;
      bullets = [];
      gameLoop();
    };

    const drawBird = () => {
      ctx.save();
      ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
      ctx.rotate(bird.velocity * 0.1);
      
      // Body
      ctx.fillStyle = isSuperPowerActive ? 'red' : 'yellow';
      ctx.beginPath();
      ctx.arc(0, 0, bird.width / 2, 0, Math.PI * 2);
      ctx.fill();

      // Wing
      ctx.fillStyle = 'orange';
      ctx.beginPath();
      if (frame % 15 < 5) {
        ctx.ellipse(0, 0, bird.width / 3, bird.height / 2, Math.PI / 4, 0, Math.PI);
      } else if (frame % 15 < 10) {
        ctx.ellipse(0, 0, bird.width / 3, bird.height / 2, Math.PI / 4, 0, Math.PI * 1.5);
      } else {
        ctx.ellipse(0, 0, bird.width / 3, bird.height / 2, Math.PI / 4, 0, Math.PI * 2);
      }
      ctx.fill();

      // Eye
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(bird.width / 4, -bird.height / 8, 2, 0, Math.PI * 2);
      ctx.fill();

      // Gun
      if (isSuperPowerActive) {
        ctx.fillStyle = 'black';
        ctx.fillRect(bird.width / 2, -2, 10, 4);
      }

      ctx.restore();
    };

    const drawPipes = () => {
      pipes.forEach(pipe => {
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

    const drawSuperPowerItem = () => {
      if (superPowerItem) {
        ctx.fillStyle = 'gold';
        ctx.fillRect(superPowerItem.x, superPowerItem.y, superPowerItem.width, superPowerItem.height);
      }
    };

    const drawBullets = () => {
      ctx.fillStyle = 'red';
      bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      });
    };

    const update = () => {
      if (gameOver) return;

      bird.velocity += gravity;
      bird.y += bird.velocity;

      // Super power timer
      if (isSuperPowerActive) {
        superPowerTimer--;
        if (superPowerTimer <= 0) {
          isSuperPowerActive = false;
        }
      }

      // Spawn super power item
      if (frame % 500 === 0 && !superPowerItem) {
        superPowerItem = {
          x: canvas.width,
          y: Math.random() * (canvas.height - 200) + 100,
          width: 20,
          height: 20,
        };
      }

      // Move super power item
      if (superPowerItem) {
        superPowerItem.x -= pipeSpeed;
        if (superPowerItem.x + superPowerItem.width < 0) {
          superPowerItem = null;
        }
      }

      // Move bullets
      bullets.forEach(bullet => {
        bullet.x += 5;
      });
      bullets = bullets.filter(bullet => bullet.x < canvas.width);

      // Collision detection: bird and super power item
      if (superPowerItem &&
          bird.x < superPowerItem.x + superPowerItem.width &&
          bird.x + bird.width > superPowerItem.x &&
          bird.y < superPowerItem.y + superPowerItem.height &&
          bird.y + bird.height > superPowerItem.y) {
        isSuperPowerActive = true;
        superPowerTimer = 180; // 3 seconds (60 fps * 3)
        superPowerItem = null;
      }

      // Collision detection: bullets and pipes
      bullets.forEach(bullet => {
        pipes.forEach(pipe => {
          if (
            bullet.x < pipe.x + pipe.width &&
            bullet.x + bullet.width > pipe.x &&
            (bullet.y < pipe.y || bullet.y + bullet.height > pipe.y + pipeGap)
          ) {
            pipes = pipes.filter(p => p !== pipe);
            bullets = bullets.filter(b => b !== bullet);
          }
        });
      });

      if (frame % 100 === 0) {
        const pipeY = Math.random() * (canvas.height - pipeGap - 200) + 100;
        pipes.push({ x: canvas.width, y: pipeY, width: pipeWidth, height: canvas.height, passed: false });
      }

      pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;
      });

      pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);

      if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameOver = true;
        setIsGameOver(true);
        saveScore().then(fetchTopScores);
      }

      pipes.forEach(pipe => {
        if (
          !isSuperPowerActive &&
          bird.x < pipe.x + pipe.width &&
          bird.x + bird.width > pipe.x &&
          (bird.y < pipe.y || bird.y + bird.height > pipe.y + pipeGap)
        ) {
          gameOver = true;
          setIsGameOver(true);
          saveScore().then(fetchTopScores);
        }

        if (pipe.x + pipe.width < bird.x && !pipe.passed) {
          setScore(prevScore => prevScore + 1);
          pipe.passed = true;
        }
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBird();
      drawPipes();
      drawSuperPowerItem();
      drawBullets();

      ctx.fillStyle = 'black';
      ctx.font = '24px Arial';
      ctx.fillText(`Score: ${score}`, 10, 30);
    };

    const gameLoop = () => {
      if (gameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '48px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 120, canvas.height / 2);
        return;
      }

      update();
      draw();
      frame++;
      requestAnimationFrame(gameLoop);
    };

    const fire = () => {
      bullets.push({
        x: bird.x + bird.width,
        y: bird.y + bird.height / 2,
        width: 10,
        height: 5,
      });
    };

    const handleJump = () => {
      if (!gameStarted) {
        setGameStarted(true);
      }
      if (!gameOver) {
        if (isSuperPowerActive) {
          fire();
        }
        bird.velocity = jumpStrength;
      }
    };

    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('click', handleJump);
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleJump();
      }
    });

    resizeCanvas();
    resetGame();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [gameStarted]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Flappy Bird Score',
        text: `I scored ${scoreRef.current} in Flappy Bird! Can you beat my score?`,
        url: window.location.href,
      });
    }
  };

  return (
    <Container fluid style={{ padding: 0 }}>
      {showVideo ? (
        <video
          src="/flappybird.mp4"
          autoPlay
          muted
          onEnded={() => setShowVideo(false)}
          style={{ width: '100%', height: '100vh', objectFit: 'cover' }}
        />
      ) : !gameStarted ? (
        <div style={{ textAlign: 'center', paddingTop: '50px' }}>
          <Image src="/flappybird1.webp" alt="Flappy Bird" width={600} height={400} />
          <h1 className="mt-4">Flappy Bird</h1>
          <Button onClick={() => setGameStarted(true)} size="lg">Start Game</Button>
        </div>
      ) : null}
      <canvas
        ref={canvasRef}
        style={{ display: gameStarted ? 'block' : 'none' }}
      ></canvas>
      {isGameOver && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
          <h2>Game Over</h2>
          <p>Your Score: {score}</p>
          <Button onClick={() => window.location.reload()} className="me-2">Restart</Button>
          <Button onClick={handleShare}>Share Score</Button>
          <div className="mt-3">
            <h3>Top 5 Scores:</h3>
            <ul className="list-unstyled">
              {topScores.map((s, index) => (
                <li key={index}>{index + 1}. {s.name}: {s.score}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Container>
  );
};

export default FlappyBirdGame;