
'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';

interface Blog {
  id: number;
  title: string;
  description: string;
  image: string; // For simplicity, we'll store the image as a base64 string
  imageWidth?: string; // Optional width for display
  imageHeight?: string; // Optional height for display
}

interface BlogContextType {
  blogs: Blog[];
  addBlog: (blog: Omit<Blog, 'id'>) => void;
  deleteBlog: (id: number) => void;
  editBlog: (blog: Blog) => void;
}

export const BlogContext = createContext<BlogContextType | undefined>(undefined);

const defaultInitialBlogs: Blog[] = [
  {
    id: 1,
    title: 'Top 5 In-Demand Tech Skills for 2025',
    description: 'Stay ahead in the competitive tech job market by mastering these highly sought-after skills, from AI and Machine Learning to Cybersecurity and Cloud Computing.',
    image: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Tech+Skills',
  },
  {
    id: 2,
    title: 'How to Write a Winning Resume: Tips from Recruiters',
    description: 'Craft a resume that stands out! Learn essential tips and tricks directly from experienced recruiters to land your dream job interview.',
    image: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Resume+Tips',
  },
  {
    id: 3,
    title: 'Navigating the Job Search: A Comprehensive Guide',
    description: 'From identifying career goals to acing interviews, this guide covers every step of the job search process to help you succeed.',
    image: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=Job+Search',
  },
];

export const BlogProvider = ({ children }: { children: ReactNode }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedBlogs = localStorage.getItem('blogs');
      if (savedBlogs) {
        try {
          const parsedBlogs = JSON.parse(savedBlogs);
          if (parsedBlogs.length === 0) { // If saved blogs are empty, load defaults
            setBlogs(defaultInitialBlogs);
          } else {
            setBlogs(parsedBlogs);
          }
        } catch (e) {
          console.error("Error parsing saved blogs, resetting to default", e);
          setBlogs(defaultInitialBlogs);
        }
      } else {
        setBlogs(defaultInitialBlogs);
      }
    } catch (error) {
      console.error('Error loading blogs from localStorage', error);
      setBlogs(defaultInitialBlogs);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('blogs', JSON.stringify(blogs));
      } catch (error) {
        console.error('Error saving blogs to localStorage', error);
      }
    }
  }, [blogs, isLoaded]);

  const addBlog = (blog: Omit<Blog, 'id'>) => {
    const newBlog = { ...blog, id: blogs.length > 0 ? Math.max(...blogs.map(b => b.id)) + 1 : 1 };
    setBlogs(prevBlogs => [newBlog, ...prevBlogs]);
  };

  const deleteBlog = (id: number) => {
    setBlogs(blogs.filter(blog => blog.id !== id));
  };

  const editBlog = (updatedBlog: Blog) => {
    setBlogs(prevBlogs =>
      prevBlogs.map(blog => (blog.id === updatedBlog.id ? updatedBlog : blog))
    );
  };

  return (
    <BlogContext.Provider value={{ blogs, addBlog, deleteBlog, editBlog }}>
      {children}
    </BlogContext.Provider>
  );
};
