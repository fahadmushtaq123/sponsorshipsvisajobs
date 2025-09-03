
'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';

interface Job {
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
  addJob: (job: Omit<Job, 'id' | 'createdAt'>) => void;
  deleteJob: (id: string) => void;
  editJob: (job: Job) => void;
}

export const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch jobs from API on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Map _id to id
        const mappedJobs = data.map((job: any) => ({
          ...job,
          id: job._id // Assuming _id is always present
        }));
        setJobs(mappedJobs);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

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
    <JobContext.Provider value={{ jobs, loading, addJob, deleteJob, editJob }}>
      {children}
    </JobContext.Provider>
  );
};
