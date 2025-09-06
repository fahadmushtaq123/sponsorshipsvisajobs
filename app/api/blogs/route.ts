import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

async function getCollection() {
  const client = await clientPromise;
  const db = client.db("job_board_db"); // Assuming the same database as jobs
  return db.collection("blogs");
}

export async function GET() {
  try {
    const collection = await getCollection();
    const blogs = (await collection.find({}).sort({ _id: -1 }).toArray()).map(blog => ({
      ...blog,
      id: blog._id.toString(),
      createdAt: new ObjectId(blog._id).getTimestamp(),
    }));
    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return NextResponse.json({ message: "Failed to fetch blogs", error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const collection = await getCollection();
    const newBlog = await request.json();
    const result = await collection.insertOne(newBlog);
    const blogWithId = { ...newBlog, id: result.insertedId.toString(), createdAt: new ObjectId(result.insertedId).getTimestamp() };
    return NextResponse.json(blogWithId, { status: 201 });
  } catch (error) {
    console.error("Failed to post blog:", error);
    return NextResponse.json({ message: "Failed to post blog", error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const collection = await getCollection();
    const updatedBlog = await request.json();
    const { id, ...updateData } = updatedBlog;

    if (!id) {
      return NextResponse.json({ message: "Blog ID is required for update" }, { status: 400 });
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    const blog = await collection.findOne({ _id: new ObjectId(id) });
    return NextResponse.json({ ...blog, id: blog?._id.toString() });
  } catch (error) {
    console.error("Failed to update blog:", error);
    return NextResponse.json({ message: "Failed to update blog", error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const collection = await getCollection();
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ message: "Blog ID is required" }, { status: 400 });
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Blog deleted" });
  } catch (error) {
    console.error("Failed to delete blog:", error);
    return NextResponse.json({ message: "Failed to delete blog", error: (error as Error).message }, { status: 500 });
  }
}
