import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ message: "No file found" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: "job_uploads" }, (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }).end(buffer);
    });

    return NextResponse.json({ success: true, url: (result as any).secure_url });
  } catch (error) {
    console.error("Failed to upload image:", error);
    return NextResponse.json({ message: "Failed to upload image", error: (error as Error).message }, { status: 500 });
  }
}
