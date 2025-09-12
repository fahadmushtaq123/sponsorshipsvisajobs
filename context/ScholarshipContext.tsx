
'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';

interface Scholarship {
  id: number;
  title: string;
  description: string;
  image: string; // For simplicity, we'll store the image as a base64 string
}

interface ScholarshipContextType {
  scholarships: Scholarship[];
  loading: boolean;
  addScholarship: (scholarship: Omit<Scholarship, 'id'>) => void;
  deleteScholarship: (id: number) => void;
}

export const ScholarshipContext = createContext<ScholarshipContextType | undefined>(undefined);

export const ScholarshipProvider = ({ children }: { children: ReactNode }) => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedScholarships = localStorage.getItem('scholarships');
      if (savedScholarships) {
        setScholarships(JSON.parse(savedScholarships));
      } else {
        setScholarships([]);
      }
    } catch (error) {
      console.error('Error loading scholarships from localStorage', error);
      setScholarships([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) { // Only save to localStorage once loading is complete
      try {
        localStorage.setItem('scholarships', JSON.stringify(scholarships));
      } catch (error) {
        console.error('Error saving scholarships to localStorage', error);
      }
    }
  }, [scholarships, loading]);

  const addScholarship = (scholarship: Omit<Scholarship, 'id'>) => {
    const newScholarship = { ...scholarship, id: scholarships.length > 0 ? Math.max(...scholarships.map(s => s.id)) + 1 : 1 };
    setScholarships(prevScholarships => [newScholarship, ...prevScholarships]);
  };

  const deleteScholarship = (id: number) => {
    setScholarships(scholarships.filter(scholarship => scholarship.id !== id));
  };

  return (
    <ScholarshipContext.Provider value={{ scholarships, loading, addScholarship, deleteScholarship }}>
      {children}
    </ScholarshipContext.Provider>
  );
};
