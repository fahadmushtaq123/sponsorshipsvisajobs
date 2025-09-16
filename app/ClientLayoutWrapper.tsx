'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SplashScreen from '../components/SplashScreen';
import { JobProvider } from '../context/JobContext';
import { AuthProvider } from '../context/AuthContext';
import { ScholarshipProvider } from '../context/ScholarshipContext';
import { BlogProvider } from '../context/BlogContext';
import { ToolProvider } from '../context/ToolContext';
import { usePathname } from 'next/navigation';

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSplash, setShowSplash] = useState(false);
  const pathname = usePathname();
  const isGamePage = pathname.startsWith('/games');

  useEffect(() => {
    const splashScreenShown = sessionStorage.getItem('splashScreenShown');
    if (!splashScreenShown) {
      setShowSplash(true);
      sessionStorage.setItem('splashScreenShown', 'true');
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 100); // 0.10 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      {showSplash ? (
        <SplashScreen />
      ) : (
        <AuthProvider>
          <JobProvider>
            <ScholarshipProvider>
              <BlogProvider>
                <ToolProvider>
                  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Header />
                    <div style={{ backgroundColor: '#ffcc00', color: '#333', textAlign: 'center', padding: '10px 0', fontSize: '1.1em', fontWeight: 'bold' }}>
                      <span className="good-news-text">GOOD NEWS:</span> we send your resume to 100+ international companies on your behalf just in 2$. <a href="/resume-submission" style={{ color: '#0000EE', textDecoration: 'underline' }}>CLICK HERE</a>
                    </div>
                    <main style={{ flex: 1, overflowY: isGamePage ? 'hidden' : 'auto' }}>{children}</main>
                    <Footer />
                  </div>
                </ToolProvider>
              </BlogProvider>
            </ScholarshipProvider>
          </JobProvider>
        </AuthProvider>
      )}
    </>
  );
}
