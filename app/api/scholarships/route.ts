import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

async function getCollection() {
  const client = await clientPromise;
  const db = client.db("job_board_db");
  return db.collection("scholarships");
}

export async function GET() {
  try {
    const collection = await getCollection();
    const scholarships = (await collection.find({}).sort({ _id: -1 }).toArray()).map(scholarship => ({
      ...scholarship,
      id: scholarship._id.toString(),
    }));
    return NextResponse.json(scholarships);
  } catch (error) {
    console.error("Failed to fetch scholarships:", error);
    return NextResponse.json({ message: "Failed to fetch scholarships", error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const collection = await getCollection();
    const newScholarship = await request.json();
    const result = await collection.insertOne(newScholarship);
    const scholarshipWithId = { ...newScholarship, id: result.insertedId.toString() };
    return NextResponse.json(scholarshipWithId, { status: 201 });
  } catch (error) {
    console.error("Failed to post scholarship:", error);
    return NextResponse.json({ message: "Failed to post scholarship", error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const collection = await getCollection();
    const updatedScholarship = await request.json();
    const { id, ...updateData } = updatedScholarship;

    if (!id) {
      return NextResponse.json({ message: "Scholarship ID is required for update" }, { status: 400 });
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Scholarship not found" }, { status: 404 });
    }

    const scholarship = await collection.findOne({ _id: new ObjectId(id) });
    return NextResponse.json({ ...scholarship, id: scholarship?._id.toString() });
  } catch (error) {
    console.error("Failed to update scholarship:", error);
    return NextResponse.json({ message: "Failed to update scholarship", error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const collection = await getCollection();
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ message: "Scholarship ID is required" }, { status: 400 });
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Scholarship not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Scholarship deleted" });
  } catch (error) {
    console.error("Failed to delete scholarship:", error);
    return NextResponse.json({ message: "Failed to delete scholarship", error: (error as Error).message }, { status: 500 });
  }
}