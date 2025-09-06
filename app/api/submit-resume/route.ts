import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    return NextResponse.json({ message: 'Test successful!' }, { status: 200 });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json({ message: 'Submission failed!', error: (error as Error).message }, { status: 500 });
  }
}
