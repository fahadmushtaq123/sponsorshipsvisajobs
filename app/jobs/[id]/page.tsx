import JobDetailsClient from './JobDetailsClient';

export async function generateStaticParams() {
  const ids = [1, 2, 3]; // Replace with actual job IDs from your data source

  return ids.map((id) => ({
    id: id.toString(),
  }));
}

export default function JobDetailsPage() {
  return <JobDetailsClient />;
}