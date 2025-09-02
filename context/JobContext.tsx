'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';

export interface Job {
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
  currentPage: number;
  setCurrentPage: (page: number) => void;
  jobsPerPage: number;
  totalJobs: number;
  setJobs: (jobs: Job[]) => void; // Expose setJobs
}

export const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(10); // You can adjust this value
  const [totalJobs, setTotalJobs] = useState(0);

  const fetchJobs = async (page: number = currentPage, limit: number = jobsPerPage) => {
    try {
      const response = await fetch(`/api/jobs?page=${page}&limit=${limit}`);
      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        return;
      }
      const data = await response.json();
      setJobs(data.jobs);
      setTotalJobs(data.totalJobs);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    }
  };

  useEffect(() => {
    fetchJobs(currentPage, jobsPerPage);
  }, [currentPage, jobsPerPage]);

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
      // Refetch jobs after adding a new one, staying on the current page
      fetchJobs(currentPage, jobsPerPage);
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
      // Refetch jobs after deleting one, staying on the current page
      fetchJobs(currentPage, jobsPerPage);
    } catch (error) {
      console.error('Failed to delete job:', error);
    }
  };

  return (
    <JobContext.Provider value={{ jobs, addJob, deleteJob, currentPage, setCurrentPage, jobsPerPage, totalJobs, setJobs }}>
      {children}
    </JobContext.Provider>
  );
};