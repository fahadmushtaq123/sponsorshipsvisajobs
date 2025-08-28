import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { name, email, subject, message } = await request.json();

  // Here you can add your logic to send an email or save the message to a database
  console.log({ name, email, subject, message });

  return NextResponse.json({ success: true });
}
