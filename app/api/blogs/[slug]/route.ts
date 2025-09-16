import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

async function getCollection() {
  const client = await clientPromise;
  const db = client.db("job_board_db");
  return db.collection("blogs");
}

export async function GET(request: Request, { params }: any) {
  try {
    const collection = await getCollection();
    const blog = await collection.findOne({ slug: params.slug });

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ ...blog, id: blog._id.toString() });
  } catch (error) {
    console.error("Failed to fetch blog:", error);
    return NextResponse.json({ message: "Failed to fetch blog", error: (error as Error).message }, { status: 500 });
  }
}
