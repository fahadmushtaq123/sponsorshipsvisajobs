import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';

import ClientLayoutWrapper from './ClientLayoutWrapper';

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
      <body>
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}
