import JobDetailsClient from './JobDetailsClient';

export async function generateStaticParams() {
  const res = await fetch('http://localhost:3000/api/jobs');
  const jobs = await res.json();
 
  return jobs.map((job: { _id: string }) => ({
    id: job._id,
  }));
}

export default function JobDetailsPage() {
  return <JobDetailsClient />;
}

export const metadata = {
  title: 'Job Details',
  description: 'Details of a specific job.',
};