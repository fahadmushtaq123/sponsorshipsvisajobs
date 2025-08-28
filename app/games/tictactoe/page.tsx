'use client';

import { useState, useEffect } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import GameRecords from '../../../components/GameRecords';

type Player = 'X' | 'O' | null;

function Square({ value, onClick }: { value: Player; onClick: () => void }) {
  return (
    <Button
      variant={value === 'X' ? 'primary' : value === 'O' ? 'success' : 'light'}
      className="square"
      onClick={onClick}
      style={{
        width: '80px',
        height: '80px',
        fontSize: '2.5rem',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid #ccc',
      }}
    role="gridcell"
    >
      {value}
    </Button>
  );
}

function Board({ squares, onClick }: { squares: Player[]; onClick: (i: number) => void }) {
  return (
    <div className="board">
      {[0, 1, 2].map(row => (
        <div key={row} className="board-row" style={{ display: 'flex' }}>
          {[0, 1, 2].map(col => {
            const i = row * 3 + col;
            return <Square key={i} value={squares[i]} onClick={() => onClick(i)} />;
          })}
        </div>
      ))}
    </div>
  );
}

function calculateWinner(squares: Player[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default function TicTacToe() {
  const [history, setHistory] = useState<Player[][]>([Array(9).fill(null)]);
  const [stepNumber, setStepNumber] = useState<number>(0);
  const xIsNext = stepNumber % 2 === 0;
  const currentSquares = history[stepNumber];

  const winner = calculateWinner(currentSquares);
  const isDraw = !winner && currentSquares.every(square => square !== null);
  const [userName, setUserName] = useState<string>('');
  const [addRecord, setAddRecord] = useState<((score: string | number) => void) | null>(null);

  const handleNameSubmit = (name: string) => {
    setUserName(name);
  };

  useEffect(() => {
    if (winner && addRecord) {
      addRecord(`${winner} wins!`);
    } else if (isDraw && addRecord) {
      addRecord('Draw!');
    }
  }, [winner, isDraw, addRecord]);

  const handleClick = (i: number) => {
    const newHistory = history.slice(0, stepNumber + 1);
    const squares = [...currentSquares];
    if (winner || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? 'X' : 'O';
    setHistory([...newHistory, squares]);
    setStepNumber(newHistory.length);
  };

  const jumpTo = (step: number) => {
    setStepNumber(step);
  };

  const moves = history.map((_step, move) => {
    const desc = move ? `Go to move #${move}` : 'Go to game start';
    return (
      <li key={move}>
        <Button variant="outline-secondary" size="sm" onClick={() => jumpTo(move)} className="my-1">
          {desc}
        </Button>
      </li>
    );
  });

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (isDraw) {
    status = 'Draw!';
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <GameRecords gameName="Tic-Tac-Toe" onNameSubmit={handleNameSubmit}>
      {({ userName: recordUserName, addRecord: recordAddRecord }) => {
        useEffect(() => {
          setAddRecord(() => recordAddRecord);
        }, [recordAddRecord]);

        return (
          <main>
            <Container className="mt-5 text-center">
            <h1>Tic-Tac-Toe</h1>
            {userName && <p>Playing as: <strong>{userName}</strong></p>}
            <Row className="justify-content-center mt-4">
              <Col xs={12} md={6} lg={4}>
                <div className="game-board" role="grid">
                  <Board squares={currentSquares} onClick={handleClick} />
                </div>
              </Col>
              <Col xs={12} md={6} lg={4} className="mt-4 mt-md-0">
                <div className="game-info">
                  <div className="mb-3" aria-live="polite" aria-atomic="true"><h3>{status}</h3></div>
                  <ol style={{ listStyleType: 'none', padding: 0 }}>{moves}</ol>
                </div>
              </Col>
            </Row>
          </Container>
          </main>
        );
      }}
    </GameRecords>
  );
}
