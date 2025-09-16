'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';

export interface Blog {
  id: number;
  title: string;
  slug: string;
  description: string;
  image: string; // For simplicity, we'll store the image as a base64 string
  imageWidth?: string; // Optional width for display
  imageHeight?: string; // Optional height for display
}

interface BlogContextType {
  blogs: Blog[];
  addBlog: (blog: Omit<Blog, 'id' | 'slug'>) => void;
  deleteBlog: (id: number) => void;
  editBlog: (blog: Blog) => void;
}

export const BlogContext = createContext<BlogContextType | undefined>(undefined);

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

export const BlogProvider = ({ children }: { children: ReactNode }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blogs');
        if (response.ok) {
          const data = await response.json();
          setBlogs(data);
        } else {
          console.error('Failed to fetch blogs:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };
    fetchBlogs();
  }, []);

  const addBlog = async (blog: Omit<Blog, 'id' | 'slug'>) => {
    try {
      const slug = slugify(blog.title);
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...blog, slug }),
      });
      if (response.ok) {
        const newBlog = await response.json();
        setBlogs(prevBlogs => [newBlog, ...prevBlogs]);
      } else {
        console.error('Failed to add blog:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding blog:', error);
    }
  };

  const deleteBlog = async (id: number) => {
    try {
      const response = await fetch('/api/blogs', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        setBlogs(prevBlogs => prevBlogs.filter(blog => blog.id !== id));
      } else {
        console.error('Failed to delete blog:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const editBlog = async (updatedBlog: Blog) => {
    try {
      const slug = slugify(updatedBlog.title);
      const response = await fetch('/api/blogs', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...updatedBlog, slug }),
      });
      if (response.ok) {
        setBlogs(prevBlogs =>
          prevBlogs.map(blog => (blog.id === updatedBlog.id ? { ...updatedBlog, slug } : blog))
        );
      } else {
        console.error('Failed to edit blog:', response.statusText);
      }
    } catch (error) {
      console.error('Error editing blog:', error);
    }
  };

  return (
    <BlogContext.Provider value={{ blogs, addBlog, deleteBlog, editBlog }}>
      {children}
    </BlogContext.Provider>
  );
};
