import PakistanJobsClient from './pakistan-jobs-client';

export const metadata = {
  title: 'Jobs in Pakistan - Find the Latest Job Opportunities',
  description: 'Browse through a wide range of jobs available in Pakistan. Find the latest job openings in various cities and industries.',
};

export default function Page() {
  return <PakistanJobsClient />;
}