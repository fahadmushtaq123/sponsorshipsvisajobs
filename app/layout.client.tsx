'use client';

import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';

import ClientLayoutWrapper from './ClientLayoutWrapper';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const authContext = useContext(AuthContext);
  const isAdmin = authContext?.isAdmin;

  return (
    <>
      {!isAdmin && (
        <script dangerouslySetInnerHTML={{ __html: "(function(s){s.dataset.zone='9773560',s.src='https://vemtoutcheeg.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))" }} />
      )}
      <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
    </>
  );
}