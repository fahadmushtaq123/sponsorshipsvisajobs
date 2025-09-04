import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

async function getCollection() {
  const client = await clientPromise;
  const db = client.db("job_board_db");
  return db.collection("submissions");
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const firstName = formData.get('firstName') as string;
    const secondName = formData.get('secondName') as string;
    const profession = formData.get('profession') as string;
    const resume = formData.get('resume') as File;
    const screenshot = formData.get('screenshot') as File;

    let resumeUrl = '';
    let screenshotUrl = '';

    // Upload resume to Cloudinary
    if (resume) {
      const bytes = await resume.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: "resumes", resource_type: "raw" }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }).end(buffer);
      });
      resumeUrl = (result as any).secure_url;
    }

    // Upload screenshot to Cloudinary
    if (screenshot) {
      const bytes = await screenshot.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: "screenshots" }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }).end(buffer);
      });
      screenshotUrl = (result as any).secure_url;
    }

    // Save submission details to MongoDB
    const collection = await getCollection();
    const newSubmission = {
      firstName,
      secondName,
      profession,
      resumeUrl,
      screenshotUrl,
      submissionDate: new Date().toISOString(),
    };

    const result = await collection.insertOne(newSubmission);

    return NextResponse.json({ message: 'Submission successful!', submissionId: result.insertedId.toString() }, { status: 200 });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json({ message: 'Submission failed!', error: (error as Error).message }, { status: 500 });
  }
}
