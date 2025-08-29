'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  image?: string | null;
}

interface JobContextType {
  jobs: Job[];
  addJob: (job: Omit<Job, 'id'>) => void;
  deleteJob: (id: string) => void;
}

export const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<Job[]>([]);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        return;
      }
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    }
  };

  useEffect(() => {
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
        console.error(`HTTP error! status: ${response.status}`);
        return;
      }
      // Refetch jobs after adding a new one
      fetchJobs();
    } catch (error) {
      console.error('Failed to add job:', error);
    }
  };

  const deleteJob = async (id: string) => {
    try {
      const response = await fetch(`/api/jobs?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        return;
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