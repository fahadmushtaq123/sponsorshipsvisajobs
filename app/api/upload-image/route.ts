import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({}, (error, uploadResult) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(error);
        }
        resolve(uploadResult);
      }).end(buffer);
    });

    return NextResponse.json({ imageUrl: (result as any).secure_url }, { status: 200 });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ message: 'Failed to upload image', error: (error as Error).message }, { status: 500 });
  }
}
