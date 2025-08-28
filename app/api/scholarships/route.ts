import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const scholarshipsFilePath = path.join(process.cwd(), 'scholarships.json');

interface Scholarship {
  id: number;
  title: string;
  description: string;
  image: string; // Base64 string
}

async function readScholarships(): Promise<Scholarship[]> {
  try {
    const fileContents = await fs.readFile(scholarshipsFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // File does not exist, return empty array
      return [];
    }
    console.error('Error reading scholarships.json:', error);
    return [];
  }
}

async function writeScholarships(scholarships: Scholarship[]): Promise<void> {
  await fs.writeFile(scholarshipsFilePath, JSON.stringify(scholarships, null, 2));
}

export async function GET() {
  const scholarships = await readScholarships();
  return NextResponse.json(scholarships);
}

export async function POST(request: Request) {
  const newScholarship: Omit<Scholarship, 'id'> = await request.json();
  const scholarships = await readScholarships();
  const newId = scholarships.length > 0 ? Math.max(...scholarships.map(s => s.id)) + 1 : 1;
  const scholarshipWithId = { ...newScholarship, id: newId };
  scholarships.push(scholarshipWithId);
  await writeScholarships(scholarships);
  return NextResponse.json(scholarshipWithId, { status: 201 });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  let scholarships = await readScholarships();
  const initialLength = scholarships.length;
  scholarships = scholarships.filter(scholarship => scholarship.id !== id);
  if (scholarships.length === initialLength) {
    return NextResponse.json({ message: 'Scholarship not found' }, { status: 404 });
  }
  await writeScholarships(scholarships);
  return NextResponse.json({ message: 'Scholarship deleted' });
}
