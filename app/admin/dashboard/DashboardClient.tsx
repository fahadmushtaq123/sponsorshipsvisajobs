'use client';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Submission } from '../../../lib/get-submissions'; // Import Submission interface

interface DashboardClientProps {
  submissions: Submission[];
  error: string | null;
}

export default function DashboardClient({ submissions, error }: DashboardClientProps) {
  const router = useRouter();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <div>Loading authentication...</div>;
  }

  const { isAdmin, role } = authContext;

  if (!isAdmin) {
    // Defer client-side navigation until component mounts
    useEffect(() => {
      router.push('/admin');
    }, [router]);
    return null;
  }

  const totalSubmissions = submissions.length;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '50px auto', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', backgroundColor: '#fff', textAlign: 'center' }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>Admin Dashboard</h1>
      <p>Logged in as: {role}</p>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <>
          <p style={{ fontSize: '1.2em', marginBottom: '20px' }}>
            Total Submissions: <span style={{ fontWeight: 'bold', color: '#007bff' }}>{totalSubmissions}</span>
          </p>
          <Link href="/admin/submissions" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold' }}>
            View All Submissions
          </Link>
        </>
      )}
    </div>
  );
}
