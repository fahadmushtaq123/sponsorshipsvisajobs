import JobDetailsClient from './JobDetailsClient';
import { getJobById } from '@/lib/get-job'; // Import the new function

export async function generateMetadata({ params }: { params: { id: string } }) {
  const job = await getJobById(params.id);

  if (!job) {
    return {
      title: 'Job Not Found',
      description: 'The requested job could not be found.',
    };
  }

  const jobTitle = job.title;
  const jobCompany = job.company;
  const jobLocation = job.location;
  const jobDescription = job.description; // Assuming description is plain text or can be sanitized

  return {
    title: `${jobTitle} at ${jobCompany} - ${jobLocation}`,
    description: jobDescription,
    openGraph: {
      title: `${jobTitle} at ${jobCompany} - ${jobLocation}`,
      description: jobDescription,
      url: `https://yourwebsite.com/jobs/${params.id}`, // Replace with your actual domain
      type: 'article',
      // Add an image if available, e.g., og:image: job.image
    },
    twitter: {
      card: 'summary_large_image',
      title: `${jobTitle} at ${jobCompany} - ${jobLocation}`,
      description: jobDescription,
      // Add an image if available, e.g., twitter:image: job.image
    },
  };
}

export default function JobDetailsPage() {
  return <JobDetailsClient />;
}