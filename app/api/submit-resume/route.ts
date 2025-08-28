import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const firstName = formData.get('firstName') as string;
    const secondName = formData.get('secondName') as string;
    const profession = formData.get('profession') as string;
    const resume = formData.get('resume') as File;
    const screenshot = formData.get('screenshot') as File;

    // Define upload directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    // Save resume file
    const resumeFileName = `${Date.now()}-${resume.name}`;
    const resumeFilePath = path.join(uploadDir, resumeFileName);
    const resumeBuffer = Buffer.from(await resume.arrayBuffer());
    await fs.writeFile(resumeFilePath, resumeBuffer);

    // Save screenshot file
    const screenshotFileName = `${Date.now()}-${screenshot.name}`;
    const screenshotFilePath = path.join(uploadDir, screenshotFileName);
    const screenshotBuffer = Buffer.from(await screenshot.arrayBuffer());
    await fs.writeFile(screenshotFilePath, screenshotBuffer);

    // Save submission details to a JSON file
    const submissionsFilePath = path.join(process.cwd(), 'submissions.json');
    let submissions = [];
    try {
      const existingSubmissions = await fs.readFile(submissionsFilePath, 'utf8');
      submissions = JSON.parse(existingSubmissions);
    } catch (error) {
      // File might not exist yet, start with an empty array
      console.log('No existing submissions file, creating new one.');
    }

    const newSubmission = {
      id: Date.now(),
      firstName,
      secondName,
      profession,
      resumePath: `/uploads/${resumeFileName}`,
      screenshotPath: `/uploads/${screenshotFileName}`,
      submissionDate: new Date().toISOString(),
    };

    submissions.push(newSubmission);
    await fs.writeFile(submissionsFilePath, JSON.stringify(submissions, null, 2));

    return NextResponse.json({ message: 'Submission successful!', submission: newSubmission }, { status: 200 });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json({ message: 'Submission failed!', error: (error as Error).message }, { status: 500 });
  }
}
