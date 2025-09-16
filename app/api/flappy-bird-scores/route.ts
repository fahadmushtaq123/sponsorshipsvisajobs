import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const scoresFilePath = path.join(process.cwd(), 'flappy-bird-scores.json');

async function getScores() {
  try {
    const data = await fs.readFile(scoresFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function saveScores(scores: any) {
  await fs.writeFile(scoresFilePath, JSON.stringify(scores, null, 2));
}

export async function GET() {
  const scores = await getScores();
  const topScores = scores.sort((a: any, b: any) => b.score - a.score).slice(0, 5);
  return NextResponse.json(topScores);
}

export async function POST(request: Request) {
  const { name, score } = await request.json();
  const scores = await getScores();
  scores.push({ name, score });
  await saveScores(scores);
  return NextResponse.json({ success: true });
}