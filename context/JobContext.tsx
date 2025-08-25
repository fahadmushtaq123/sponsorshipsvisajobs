
'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  image?: string | null;
}

interface JobContextType {
  jobs: Job[];
  addJob: (job: Omit<Job, 'id'>) => void;
  deleteJob: (id: number) => void;
}

export const JobContext = createContext<JobContextType | undefined>(undefined);

const defaultInitialJobs: Job[] = [
  {
    id: 1,
    title: 'Software Engineer',
    company: 'Tech Corp',
    location: 'Lahore, Pakistan',
    description: 'We are looking for a skilled software engineer to join our team.',
    image: null,
  },
  {
    id: 2,
    title: 'Product Manager',
    company: 'Innovate Inc',
    location: 'Karachi, Pakistan',
    description: 'We are seeking an experienced product manager to lead our new product line.',
    image: null,
  },
  {
    id: 3,
    title: 'Data Scientist',
    company: 'Data Insights',
    location: 'Bangalore, India',
    description: 'We are looking for a data scientist to analyze our data.',
    image: null,
  },
  {
    id: 4,
    title: 'Government IT Officer',
    company: 'Federal Bureau',
    location: 'Islamabad, Pakistan Government',
    description: 'Seeking IT Officer for government department.',
    image: null,
  },
  {
    id: 5,
    title: 'Public Relations Specialist',
    company: 'Ministry of Information',
    location: 'Delhi, India Government',
    description: 'PR role in government sector.',
    image: null,
  },
  {
    id: 6,
    title: 'Civil Engineer',
    company: 'Local Municipality',
    location: 'Lahore, Pakistan Government',
    description: 'Civil engineering position in local government.',
    image: null,
  },
  {
    id: 7,
    title: 'Pakistani Government Analyst',
    company: 'Ministry of Finance',
    location: 'Islamabad, Pakistan Government',
    description: 'Analyst position in Pakistani government.',
    image: null,
  },
  {
    id: 8,
    title: 'Pakistani Government Teacher',
    company: 'Education Department',
    location: 'Lahore, Pakistan Government',
    description: 'Teaching position in Pakistani government school.',
    image: null,
  },
];

export const JobProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load jobs from localStorage only on the client-side after initial render
  useEffect(() => {
    try {
      const savedJobs = localStorage.getItem('jobs');
      if (savedJobs) {
        try {
          const parsedJobs = JSON.parse(savedJobs);
          if (Array.isArray(parsedJobs) && parsedJobs.length > 0) {
            setJobs(parsedJobs);
          } else {
            setJobs(defaultInitialJobs);
          }
        } catch (e) {
          console.error("Error parsing saved jobs, resetting to default", e);
          setJobs(defaultInitialJobs);
        }
      } else {
        setJobs(defaultInitialJobs);
      }
    } catch (error) {
      console.error('Error loading jobs from localStorage', error);
      setJobs(defaultInitialJobs); // Fallback to default if there's an error
    }
    setIsLoaded(true);
  }, []);

  // Save jobs to localStorage whenever the jobs state changes
  useEffect(() => {
    // We only save to localStorage after the initial load is complete
    if (isLoaded) {
      try {
        localStorage.setItem('jobs', JSON.stringify(jobs));
      } catch (error) {
        console.error('Error saving jobs to localStorage', error);
      }
    }
  }, [jobs, isLoaded]);

    const addJob = (job: Omit<Job, 'id'>) => {
    const newJob = { ...job, id: jobs.length > 0 ? Math.max(...jobs.map(j => j.id)) + 1 : 1 };
    setJobs(prevJobs => [newJob, ...prevJobs]);
  };

  const deleteJob = (id: number) => {
    setJobs(jobs.filter(job => job.id !== id));
  };

  return (
    <JobContext.Provider value={{ jobs, addJob, deleteJob }}>
      {children}
    </JobContext.Provider>
  );
};
