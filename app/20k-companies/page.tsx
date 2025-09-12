import { Metadata } from 'next';
import path from 'path';
import fs from 'fs/promises';

export const metadata: Metadata = {
  title: 'Explore 20,000+ Companies | Your Job Board',
  description: 'Browse through a curated list of over 20,000 companies. Find your next employer and explore job opportunities.',
  keywords: ['companies', 'employers', 'sponsorship visa jobs', 'career opportunities', 'company list'],
};

interface Company {
  name: string;
  website: string;
}

export default async function TwentyKCompaniesPage() {
  const filePath = path.join(process.cwd(), 'international_companies_1200.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const companies: Company[] = JSON.parse(fileContents);

  return (
    <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f3f4f6' }}>
      <h1 style={{ fontSize: '3rem', color: '#111827', marginBottom: '10px' }}>Explore Over 20,000 Companies</h1>
      <p style={{ fontSize: '1.2rem', color: '#4b5563', marginBottom: '40px' }}>
        Our Recruitment company agents send your resume to multiple company on your behalf according to your profession.
      </p>
      <div style={{ maxWidth: '800px', margin: '0 auto', maxHeight: '70vh', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', backgroundColor: '#ffffff' }}>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {companies.map((company, index) => (
            <li key={index} style={{ marginBottom: '10px', padding: '10px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold', color: '#333' }}>{company.name}</span>
              {company.website && (
                                 <a href={company.website} target="_blank" rel="noopener noreferrer" style={{ color: '#0070f3', textDecoration: 'none', marginLeft: '20px' }}>
                  Visit Website
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

