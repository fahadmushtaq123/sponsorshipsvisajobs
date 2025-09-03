import { getSubmissions, Submission } from '../../../lib/get-submissions';
import Link from 'next/link';

export default async function SubmissionsPage() {
  let submissions: Submission[] = [];
  let error: string | null = null;

  try {
    submissions = await getSubmissions();
  } catch (e) {
    error = 'Error loading submissions data.';
    console.error(e);
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '50px auto', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>All Submissions</h1>
      {error ? (
        <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
      ) : submissions.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#555' }}>No submissions found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>First Name</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Second Name</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Profession</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Resume</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Screenshot</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Submission Date</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.id}>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{submission.id}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{submission.firstName}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{submission.secondName}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{submission.profession}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  {submission.resumePath && (
                    <Link href={submission.resumePath} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'none' }}>
                      View Resume
                    </Link>
                  )}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  {submission.screenshotPath && (
                    <Link href={submission.screenshotPath} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'none' }}>
                      View Screenshot
                    </Link>
                  )}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{new Date(submission.submissionDate).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
