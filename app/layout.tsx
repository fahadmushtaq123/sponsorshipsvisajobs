// import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';

import ClientLayoutWrapper from "./ClientLayoutWrapper";
// import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = {
  title: "Sponsorships Visa Jobs",
  description: "Find jobs with visa sponsorship",
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
        <SpeedInsights />
      </body>
    </html>
  );
}