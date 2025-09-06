'use client';

import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';

import ClientLayoutWrapper from './ClientLayoutWrapper';

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: "(function(s){s.dataset.zone='9773560',s.src='https://vemtoutcheeg.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))" }} />
      <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
    </>
  );
}