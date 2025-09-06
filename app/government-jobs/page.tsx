import GovernmentJobsClient from './government-jobs-client';

export const metadata = {
  title: 'Government Jobs in Pakistan - Latest Vacancies',
  description: 'Find the latest government jobs in Pakistan. We have a wide range of job opportunities in the public sector.',
};

export default function Page() {
  return <GovernmentJobsClient />;
}