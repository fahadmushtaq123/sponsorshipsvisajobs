
'use client';

import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  image?: string | null;
  createdAt: Date;
}

interface JobContextType {
  jobs: Job[];
  loading: boolean;
  fetchJobs: (title?: string) => void;
  addJob: (job: Omit<Job, 'id' | 'createdAt'>) => void;
  deleteJob: (id: string) => void;
  editJob: (job: Job) => void;
}

export const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(async (title?: string) => {
    setLoading(true);
    try {
      const url = title ? `/api/jobs?title=${encodeURIComponent(title)}` : '/api/jobs';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const mappedJobs = data.map((job: any) => ({
        ...job,
        id: job._id
      }));
      setJobs(mappedJobs);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const addJob = async (job: Omit<Job, 'id' | 'createdAt'>) => {
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
      const { jobId } = await response.json();
      const newJob = { ...job, id: jobId, createdAt: new Date() };
      setJobs(prevJobs => [newJob, ...prevJobs]);
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setJobs(prevJobs => prevJobs.filter(job => job.id !== id));
    } catch (error) {
      console.error('Failed to delete job:', error);
    }
  };

  const editJob = async (job: Job) => {
    try {
      const response = await fetch('/api/jobs', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(job),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { updatedJob } = await response.json();
      const { _id, ...rest } = updatedJob;
      const newUpdatedJob = { ...rest, id: _id };
      setJobs(prevJobs => prevJobs.map(j => (j.id === newUpdatedJob.id ? newUpdatedJob : j)));
    } catch (error) {
      console.error('Failed to edit job:', error);
    }
  };

  return (
    <JobContext.Provider value={{ jobs, loading, fetchJobs, addJob, deleteJob, editJob }}>
      {children}
    </JobContext.Provider>
  );
};
