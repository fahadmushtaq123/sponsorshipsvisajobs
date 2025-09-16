
'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';

export interface Scholarship {
  id: string;
  title: string;
  description: string;
  image: string;
}

interface ScholarshipContextType {
  scholarships: Scholarship[];
  loading: boolean;
  addScholarship: (scholarship: Omit<Scholarship, 'id'>) => void;
  deleteScholarship: (id: string) => void;
  editScholarship: (scholarship: Scholarship) => void;
}

export const ScholarshipContext = createContext<ScholarshipContextType | undefined>(undefined);

export const ScholarshipProvider = ({ children }: { children: ReactNode }) => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const response = await fetch('/api/scholarships');
        if (response.ok) {
          const data = await response.json();
          setScholarships(data);
        } else {
          console.error('Failed to fetch scholarships:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching scholarships:', error);
      }
      setLoading(false);
    };
    fetchScholarships();
  }, []);

  const addScholarship = async (scholarship: Omit<Scholarship, 'id'>) => {
    try {
      const response = await fetch('/api/scholarships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scholarship),
      });
      if (response.ok) {
        const newScholarship = await response.json();
        setScholarships(prevScholarships => [newScholarship, ...prevScholarships]);
      } else {
        console.error('Failed to add scholarship:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding scholarship:', error);
    }
  };

  const deleteScholarship = async (id: string) => {
    try {
      const response = await fetch('/api/scholarships', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        setScholarships(prevScholarships => prevScholarships.filter(s => s.id !== id));
      } else {
        console.error('Failed to delete scholarship:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting scholarship:', error);
    }
  };

  const editScholarship = async (updatedScholarship: Scholarship) => {
    try {
      const response = await fetch('/api/scholarships', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedScholarship),
      });
      if (response.ok) {
        setScholarships(prevScholarships =>
          prevScholarships.map(s => (s.id === updatedScholarship.id ? updatedScholarship : s))
        );
      } else {
        console.error('Failed to edit scholarship:', response.statusText);
      }
    } catch (error) {
      console.error('Error editing scholarship:', error);
    }
  };

  return (
    <ScholarshipContext.Provider value={{ scholarships, loading, addScholarship, deleteScholarship, editScholarship }}>
      {children}
    </ScholarshipContext.Provider>
  );
};
