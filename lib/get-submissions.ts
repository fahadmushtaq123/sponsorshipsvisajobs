import { promises as fs } from 'fs';
import path from 'path';

export interface Submission {
  id: number;
  firstName: string;
  secondName: string;
  profession: string;
  resumePath: string;
  screenshotPath: string;
  submissionDate: string;
}

export async function getSubmissions(): Promise<Submission[]> {
  const submissionsFilePath = path.join(process.cwd(), 'submissions.json');
  try {
    const fileContents = await fs.readFile(submissionsFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (e) {
    console.error('Error reading submissions.json:', e);
    return [];
  }
}
