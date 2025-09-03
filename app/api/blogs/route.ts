import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const blogsFilePath = path.join(process.cwd(), 'data', 'blogs.json');

function readBlogs() {
  try {
    const blogsData = fs.readFileSync(blogsFilePath, 'utf-8');
    return JSON.parse(blogsData);
  } catch (error) {
    console.error('Error reading blogs.json:', error);
    return [];
  }
}

function writeBlogs(blogs: any[]) {
  try {
    fs.writeFileSync(blogsFilePath, JSON.stringify(blogs, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing blogs.json:', error);
  }
}

export async function GET() {
  const blogs = readBlogs();
  return NextResponse.json(blogs);
}

export async function POST(request: Request) {
  const newBlog = await request.json();
  const blogs = readBlogs();
  const newId = blogs.length > 0 ? Math.max(...blogs.map((b: any) => b.id)) + 1 : 1;
  const blogWithId = { ...newBlog, id: newId };
  blogs.unshift(blogWithId); // Add to the beginning
  writeBlogs(blogs);
  return NextResponse.json(blogWithId, { status: 201 });
}

export async function PUT(request: Request) {
  const updatedBlog = await request.json();
  let blogs = readBlogs();
  blogs = blogs.map((blog: any) =>
    blog.id === updatedBlog.id ? updatedBlog : blog
  );
  writeBlogs(blogs);
  return NextResponse.json(updatedBlog);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  let blogs = readBlogs();
  blogs = blogs.filter((blog: any) => blog.id !== id);
  writeBlogs(blogs);
  return NextResponse.json({ message: 'Blog deleted' });
}