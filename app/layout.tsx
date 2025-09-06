import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';

import RootLayoutClient from './layout.client';

export const metadata = {
  title: 'Sponsorship Visa Jobs - Find Your Next Career Opportunity',
  description: 'Discover thousands of job opportunities across various industries and locations. Your ultimate destination for job searching and career growth.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
      </head>
      <body>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}