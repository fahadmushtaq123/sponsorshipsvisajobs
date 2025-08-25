import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const jobsFilePath = path.join(process.cwd(), 'jobs.json');

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  image?: string | null;
}

async function readJobs(): Promise<Job[]> {
  try {
    const fileContents = await fs.readFile(jobsFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // File does not exist, return empty array
      return [];
    }
    console.error('Error reading jobs.json:', error);
    return [];
  }
}

async function writeJobs(jobs: Job[]): Promise<void> {
  await fs.writeFile(jobsFilePath, JSON.stringify(jobs, null, 2));
}

export async function GET() {
  const jobs = await readJobs();
  return NextResponse.json(jobs);
}

export async function POST(request: Request) {
  const newJob: Omit<Job, 'id'> = await request.json();
  const jobs = await readJobs();
  const newId = jobs.length > 0 ? Math.max(...jobs.map(job => job.id)) + 1 : 1;
  const jobWithId = { ...newJob, id: newId };
  jobs.push(jobWithId);
  await writeJobs(jobs);
  return NextResponse.json(jobWithId, { status: 201 });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  let jobs = await readJobs();
  const initialLength = jobs.length;
  jobs = jobs.filter(job => job.id !== id);
  if (jobs.length === initialLength) {
    return NextResponse.json({ message: 'Job not found' }, { status: 404 });
  }
  await writeJobs(jobs);
  return NextResponse.json({ message: 'Job deleted' });
}
