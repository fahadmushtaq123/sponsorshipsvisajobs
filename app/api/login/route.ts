import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const usersFilePath = path.join(process.cwd(), 'users.json');
  let users = [];

  try {
    const fileContents = await fs.readFile(usersFilePath, 'utf8');
    users = JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading users.json:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    return NextResponse.json({ success: true, isAdmin: user.role === 'SuperAdmin', role: user.role });
  } else {
    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
  }
}
