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
      <head>
        <meta name="google-adsense-account" content="ca-pub-6708928200370482"></meta>
      </head>
      <body>
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        <script type='text/javascript' src='//financialwagerepel.com/54/f9/fb/54f9fbb6b641361cccba687846a7f59a.js'></script>
      </body>
    </html>
  );
}
