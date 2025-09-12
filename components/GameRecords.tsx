'use client';

import { useState, useEffect } from 'react';
import { Modal, Button, Form, ListGroup } from 'react-bootstrap';

interface GameRecord {
  name: string;
  score: string | number;
  date: string;
}

interface GameRecordsProps {
  gameName: string;
  onNameSubmit: (name: string) => void;
  children: (props: { userName: string; addRecord: (score: string | number) => void; }) => React.ReactNode;
}

export default function GameRecords({ gameName, onNameSubmit, children }: GameRecordsProps) {
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [records, setRecords] = useState<GameRecord[]>([]);

  useEffect(() => {
    const storedName = localStorage.getItem(`${gameName}-userName`);
    if (storedName) {
      setUserName(storedName);
      setShowModal(false);
    } else {
      setShowModal(true);
    }

    const storedRecords = localStorage.getItem(`${gameName}-records`);
    if (storedRecords) {
      setRecords(JSON.parse(storedRecords));
    }
  }, [gameName]);

  useEffect(() => {
    if (userName) {
      localStorage.setItem(`${gameName}-userName`, userName);
      onNameSubmit(userName);
    }
  }, [userName, gameName, onNameSubmit]);

  const handleNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userName.trim()) {
      setShowModal(false);
    }
  };

  const addRecord = (score: string | number) => {
    if (!userName) return;
    const newRecord: GameRecord = {
      name: userName,
      score: score,
      date: new Date().toLocaleString(),
    };
    const updatedRecords = [...records, newRecord].sort((a, b) => {
      // Sort by score, assuming higher is better for most games
      // You might need to adjust this sorting logic per game
      if (typeof a.score === 'number' && typeof b.score === 'number') {
        return b.score - a.score;
      } else {
        return 0; // No specific sorting for non-numeric scores
      }
    });
    setRecords(updatedRecords);
    localStorage.setItem(`${gameName}-records`, JSON.stringify(updatedRecords));
  };

  return (
    <>
      <Modal show={showModal} onHide={() => {}} backdrop="static" keyboard={false}>
        <Modal.Header>
          <Modal.Title>Enter Your Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleNameSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Please enter your name to play {gameName}:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Start Game
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {children({ userName, addRecord })}

      {records.length > 0 && (
        <div className="mt-5">
          <h3>{gameName} Records</h3>
          <ListGroup>
            {records.map((record, index) => (
              <ListGroup.Item key={index}>
                <strong>{record.name}</strong>: {record.score} ({record.date})
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}
    </>
  );
}
