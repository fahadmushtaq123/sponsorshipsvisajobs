import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';

import ClientLayoutWrapper from './ClientLayoutWrapper';

export const metadata = {
  title: 'Sponsorship Visa Jobs - Find Your Next Career Opportunity',
  description: 'Discover thousands of job opportunities across various industries and locations. Your ultimate destination for job searching and career growth.',
  other: {
    monetag: '22f8f07698e7316e5ac699e84e0b77c2',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <script src="https://fpyf8.com/88/tag.min.js" data-zone="166261" async data-cfasync="false"></script>
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}
