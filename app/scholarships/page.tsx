import ScholarshipsClient from './scholarships-client';

export const metadata = {
  title: 'Scholarships for Pakistani Students - Study Abroad',
  description: 'Find scholarships for Pakistani students to study abroad. We have a wide range of scholarships for various countries and universities.',
};

export default function Page() {
  return <ScholarshipsClient />;
}