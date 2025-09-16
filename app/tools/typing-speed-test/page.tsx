'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Container, Form, Button } from 'react-bootstrap';

const TypingSpeedTest = () => {
  const [text, setText] = useState("The quick brown fox jumps over the lazy dog.");
  const [userInput, setUserInput] = useState("");
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 1000);
    } else if (!isActive && timer !== 0) {
      if (interval) {
        clearInterval(interval);
      }
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, timer]);

  const handleStart = () => {
    setIsActive(true);
    setUserInput("");
    setTimer(0);
    setWpm(0);
    setAccuracy(0);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isActive) {
      setIsActive(true);
    }
    setUserInput(e.target.value);
    if (e.target.value.length === text.length) {
      setIsActive(false);
      calculateResults();
    }
  };

  const calculateResults = () => {
    const words = text.split(" ").length;
    const timeInMinutes = timer / 60;
    const wpm = Math.round(words / timeInMinutes);
    setWpm(wpm);

    let correctChars = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === text[i]) {
        correctChars++;
      }
    }
    const accuracy = Math.round((correctChars / text.length) * 100);
    setAccuracy(accuracy);
  };

  const renderText = () => {
    return text.split("").map((char, index) => {
      let color = "gray";
      if (index < userInput.length) {
        color = char === userInput[index] ? "green" : "red";
      }
      return <span key={index} style={{ color }}>{char}</span>;
    });
  };

  return (
    <Container className="mt-5 text-center">
      <h1>Typing Speed Test</h1>
      <p className="lead">Test your typing skills!</p>
      <div className="mt-4">
        <h3>{renderText()}</h3>
        <Form.Control
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Start typing..."
          disabled={!isActive && timer > 0}
        />
        <div className="mt-3">
          <p>Time: {timer}s</p>
          <p>WPM: {wpm}</p>
          <p>Accuracy: {accuracy}%</p>
        </div>
        <Button onClick={handleStart} className="mt-3">
          {isActive || timer > 0 ? "Restart" : "Start"}
        </Button>
      </div>
    </Container>
  );
};

export default TypingSpeedTest;
