'use client';
import JobEditClient from './JobEditClient';
import { JobContext } from '../../../../context/JobContext';
import { useContext } from 'react';
import { useParams } from 'next/navigation';

export default function JobEditPage() {
  const context = useContext(JobContext);
  const params = useParams();
  const jobId = params.id;

  if (!context) {
    return <div>Loading...</div>;
  }

  const { jobs, loading } = context;

  if (loading) {
    return <div>Loading...</div>;
  }

  const job = jobs.find(j => j.id === jobId);

  if (!job) {
    return <div>Job not found</div>;
  }

  return <JobEditClient job={job} />;
}
