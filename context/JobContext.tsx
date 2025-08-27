
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

export const JobProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<Job[]>([]);

  // Fetch jobs from API on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      }
    };
    fetchJobs();
  }, []);

    const addJob = async (job: Omit<Job, 'id'>) => {
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(job),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newJob = await response.json();
      // Assuming the API returns the created job with an ID
      setJobs(prevJobs => [newJob, ...prevJobs]);
    } catch (error) {
      console.error('Failed to add job:', error);
    }
  };

  const deleteJob = async (id: number) => {
    try {
      const response = await fetch(`/api/jobs?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setJobs(prevJobs => prevJobs.filter(job => job.id !== id));
    } catch (error) {
      console.error('Failed to delete job:', error);
    }
  };

  return (
    <JobContext.Provider value={{ jobs, addJob, deleteJob }}>
      {children}
    </JobContext.Provider>
  );
};
