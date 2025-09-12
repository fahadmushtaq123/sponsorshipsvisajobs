import { promises as fs } from 'fs';
import path from 'path';
import ProfileClient from './ProfileClient';

interface UserProfile {
  email: string;
  role: string;
}

export default async function ProfilePage() {
  let users: UserProfile[] = [];

  try {
    const usersFilePath = path.join(process.cwd(), 'users.json');
    const fileContents = await fs.readFile(usersFilePath, 'utf8');
    users = JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading users.json:', error);
  }

  return (
    <ProfileClient users={users} />
  );
}
