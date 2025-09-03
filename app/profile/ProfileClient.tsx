'use client';

import { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

interface UserProfile {
  email: string;
  role: string;
}

interface ProfileClientProps {
  users: UserProfile[];
}

export default function ProfileClient({ users }: ProfileClientProps) {
  const router = useRouter();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (!authContext || !authContext.isAdmin) {
      router.push('/admin'); // Redirect to login if not authenticated
    }
  }, [authContext, router]);

  if (!authContext || !authContext.isAdmin) {
    return <div>Loading profile...</div>; // Or a loading spinner
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '50px auto', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', backgroundColor: '#fff', textAlign: 'center' }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>Admin Profiles</h1>
      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        {users.map((user, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #eee',
              borderRadius: '8px',
              padding: '20px',
              margin: '10px',
              flexBasis: '30%',
              minWidth: '250px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              cursor: 'pointer', // Add cursor pointer to indicate clickability
            }}
            onClick={() => {
              if (authContext && authContext.switchUser) {
                authContext.switchUser(user.email, user.role);
                router.push('/admin/dashboard'); // Redirect after switching
              }
            }}
          >
            <h2 style={{ color: user.role === 'SuperAdmin' ? '#007bff' : '#28a745', marginBottom: '10px' }}>{user.email.split('@')[0]}</h2> {/* Display name from email */}
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
