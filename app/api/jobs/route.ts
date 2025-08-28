
import { NextResponse } from 'next/server';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  image?: string | null;
}

// Mock data
let jobs: Job[] = [
  {
    id: 1,
    title: 'Software Engineer',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    description: 'Developing amazing software.',
    image: null,
  },
  {
    id: 2,
    title: 'Product Manager',
    company: 'Innovate Inc',
    location: 'New York, NY',
    description: 'Managing the product lifecycle.',
    image: null,
  },
];

export async function GET() {
  return NextResponse.json(jobs);
}

export async function POST(req: Request) {
  try {
    const jobData = await req.json();
    const newJob: Job = {
      id: jobs.length + 1,
      ...jobData,
    };
    jobs.push(newJob);
    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to post job", error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: "Job ID is required" }, { status: 400 });
    }

    const jobIndex = jobs.findIndex(job => job.id === parseInt(id, 10));

    if (jobIndex === -1) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    jobs.splice(jobIndex, 1);

    return NextResponse.json({ message: "Job deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete job", error: (error as Error).message }, { status: 500 });
  }
}
