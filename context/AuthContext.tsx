
'use client';

import { createContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  isAdmin: boolean;
  role: string; // Added role
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchUser: (email: string, role: string) => void; // Add this line
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [role, setRole] = useState('Guest'); // Initialize role

  useEffect(() => {
    const loggedIn = localStorage.getItem('isAdmin') === 'true';
    const userRole = localStorage.getItem('userRole') || 'Guest';
    if (loggedIn) {
      setIsAdmin(true);
      setRole(userRole);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('userRole', data.role);
        localStorage.setItem('userEmail', email); // Add this line
        setIsAdmin(true);
        setRole(data.role);
        return true;
      } else {
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail'); // Add this line
        setIsAdmin(false);
        setRole('Guest');
        return false;
      }
    } catch (error) {
      console.error('Login API error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userRole');
    setIsAdmin(false);
    setRole('Guest');
  };

  const switchUser = (email: string, newRole: string) => {
    const newIsAdmin = newRole === 'SuperAdmin';
    localStorage.setItem('isAdmin', newIsAdmin.toString());
    localStorage.setItem('userRole', newRole);
    localStorage.setItem('userEmail', email);
    setIsAdmin(newIsAdmin);
    setRole(newRole);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, role, login, logout, switchUser }}>
      {children}
    </AuthContext.Provider>
  );
};
