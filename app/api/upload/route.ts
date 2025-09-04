import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ message: "No file found" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${file.name}`;
    const uploadsDir = join(process.cwd(), 'public/uploads');
    const path = join(uploadsDir, filename);

    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Ignore error if directory already exists
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }

    await writeFile(path, buffer);

    return NextResponse.json({ success: true, url: `/uploads/${filename}` });
  } catch (error) {
    console.error("Failed to upload image:", error);
    return NextResponse.json({ message: "Failed to upload image", error: (error as Error).message }, { status: 500 });
  }
}
