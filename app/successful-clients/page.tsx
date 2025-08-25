import path from 'path';
import fs from 'fs/promises';

interface Client {
  name: string;
  country: string;
  location: string;
  company: string;
  job_title: string;
}

export default async function SuccessfulClientsPage() {
  const filePath = path.join(process.cwd(), 'random_people_jobs_with_locations_700.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const clients: Client[] = JSON.parse(fileContents);

  return (
    <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f3f4f6' }}>
      <h1 style={{ fontSize: '3rem', color: '#111827', marginBottom: '10px' }}>Our Successful Clients</h1>
      <p style={{ fontSize: '1.2rem', color: '#4b5563', marginBottom: '40px' }}>
        We send you resume to 100+ international companies on your behalf just in <span style={{ color: '#FF007F', fontWeight: 'bold', fontSize: '1.3em' }}>2$</span>.
      </p>
      <div style={{ maxWidth: '800px', margin: '0 auto', maxHeight: '70vh', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', backgroundColor: '#ffffff' }}>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {clients.map((client, index) => (
            <li key={index} style={{ marginBottom: '10px', padding: '10px', borderBottom: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontWeight: 'bold', color: '#333' }}>{client.name}</span>
              <span style={{ fontSize: '0.9rem', color: '#666' }}>{client.job_title} at {client.company}</span>
              <span style={{ fontSize: '0.9rem', color: '#666' }}>{client.location}, {client.country}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
