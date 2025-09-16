'use client';

import { useState, useEffect, useCallback } from 'react';
import { Container, Button, Row, Col, Alert } from 'react-bootstrap';
import GameRecords from '../../../components/GameRecords';

const TILE_COUNT = 16; // For a 4x4 puzzle
const BOARD_SIZE = 4; // 4x4 grid
const IMAGE_URL = '/compressed/common-bg.png'; // Using an existing image from your public folder

export default function TilePuzzle() {
  const [tiles, setTiles] = useState<number[]>([]);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [addRecord, setAddRecord] = useState<((score: string | number) => void) | null>(null);

  const handleNameSubmit = (name: string) => {
    setUserName(name);
  };

  const shuffleTiles = useCallback(() => {
    const solvedTiles = Array.from({ length: TILE_COUNT }, (_, i) => i);
    let shuffled: number[];
    do {
      shuffled = solvedTiles.sort(() => Math.random() - 0.5);
    } while (!isSolvable(shuffled));
    setTiles(shuffled);
    setIsSolved(false);
  }, []);

  useEffect(() => {
    shuffleTiles();
  }, [shuffleTiles]);

  const isSolvable = (arr: number[]) => {
    let inversions = 0;
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] !== TILE_COUNT - 1 && arr[j] !== TILE_COUNT - 1 && arr[i] > arr[j]) {
          inversions++;
        }
      }
    }
    return inversions % 2 === 0;
  };

  const getEmptyTileIndex = useCallback(() => {
    return tiles.indexOf(TILE_COUNT - 1);
  }, [tiles]);

  const canMove = useCallback((clickedIndex: number) => {
    const emptyIndex = getEmptyTileIndex();
    const clickedRow = Math.floor(clickedIndex / BOARD_SIZE);
    const clickedCol = clickedIndex % BOARD_SIZE;
    const emptyRow = Math.floor(emptyIndex / BOARD_SIZE);
    const emptyCol = emptyIndex % BOARD_SIZE;

    const isAdjacent =
      (Math.abs(clickedRow - emptyRow) === 1 && clickedCol === emptyCol) ||
      (Math.abs(clickedCol - emptyCol) === 1 && clickedRow === emptyRow);

    return isAdjacent;
  }, [getEmptyTileIndex]);

  const moveTile = useCallback((clickedIndex: number) => {
    if (isSolved || !canMove(clickedIndex)) return;

    const newTiles = [...tiles];
    const emptyIndex = getEmptyTileIndex();

    [newTiles[clickedIndex], newTiles[emptyIndex]] = [
      newTiles[emptyIndex],
      newTiles[clickedIndex],
    ];
    setTiles(newTiles);
  }, [isSolved, canMove, tiles, getEmptyTileIndex]);

  useEffect(() => {
    const solved = tiles.every((tile, index) => tile === index);
    setIsSolved(solved);
    if (solved && addRecord) {
      addRecord('Solved!');
    }
  }, [tiles, addRecord]);

  return (
    <GameRecords gameName="Tile Puzzle" onNameSubmit={handleNameSubmit}>
      {({ userName: recordUserName, addRecord: recordAddRecord }) => {
        useEffect(() => {
          setAddRecord(() => recordAddRecord);
        }, [recordAddRecord]);

        return (
          <main>
            <Container className="mt-5 text-center">
              <h1>Tile Puzzle</h1>
              {userName && <p>Playing as: <strong>{userName}</strong></p>}
              <p className="lead">Arrange the tiles to complete the image!</p>

              <div
                role="grid"
                className="mx-auto"
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
                  width: 'clamp(280px, 90vw, 400px)',
                  height: 'clamp(280px, 90vw, 400px)',
                  border: '2px solid #333',
                  position: 'relative',
                }}
              >
                {tiles.map((tile, index) => (
                  <div
                    key={index}
                    onClick={() => moveTile(index)}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: '1px solid #eee',
                      boxSizing: 'border-box',
                      cursor: tile === TILE_COUNT - 1 ? 'default' : 'pointer',
                      backgroundColor: tile === TILE_COUNT - 1 ? '#f0f0f0' : 'transparent',
                      backgroundImage: tile !== TILE_COUNT - 1 ? `url(${IMAGE_URL})` : 'none',
                      backgroundSize: `400% 400%`,
                      backgroundPosition: `calc(${(tile % BOARD_SIZE) * (100 / (BOARD_SIZE - 1))}% - ${tile % BOARD_SIZE === 0 ? 0 : (tile % BOARD_SIZE) * 0}px) calc(${Math.floor(tile / BOARD_SIZE) * (100 / (BOARD_SIZE - 1))}% - ${Math.floor(tile / BOARD_SIZE) === 0 ? 0 : Math.floor(tile / BOARD_SIZE) * 0}px)`,
                      transition: 'background-color 0.3s ease',
                    }}
                    role="gridcell"
                    aria-label={tile === TILE_COUNT - 1 ? 'Empty space' : `Tile ${tile + 1}`}
                  >
                  </div>
                ))}
              </div>

              {isSolved && (
                <Alert variant="success" className="mt-3" aria-live="polite" aria-atomic="true">
                  Congratulations! You solved the puzzle!
                </Alert>
              )}

              <Button onClick={shuffleTiles} className="mt-3">
                {isSolved ? 'Play Again' : 'Shuffle'}
              </Button>
            </Container>
          </main>
        );
      }}
    </GameRecords>
  );
}
