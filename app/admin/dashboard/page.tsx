import { getSubmissions, Submission } from '../../../lib/get-submissions';
import DashboardClient from './DashboardClient';

export default async function AdminDashboardPage() {
  let submissions: Submission[] = [];
  let error: string | null = null;

  try {
    submissions = await getSubmissions();
  } catch (e) {
    error = 'Error loading submissions data.';
    console.error(e);
  }

  return (
    <DashboardClient submissions={submissions} error={error} />
  );
}
