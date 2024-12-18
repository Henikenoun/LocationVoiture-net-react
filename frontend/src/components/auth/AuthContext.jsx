import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [timeoutId, setTimeoutId] = useState(null);
  const sessionTimeoutDuration = 3600000; // 1 hour in milliseconds

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:5074/api/Account/GetCurrentUser', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
        startSessionTimeout();
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    if (localStorage.getItem('token') && !user) {
      fetchUser();
    }

    return () => {
      clearSessionTimeout();
    };
  }, [user]);

  const startSessionTimeout = () => {
    clearSessionTimeout();
    const id = setTimeout(() => {
      logout();
    }, sessionTimeoutDuration);
    setTimeoutId(id);
  };

  const clearSessionTimeout = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5074/api/Account/Login', { email, password });
      localStorage.setItem('token', response.data.token);

      // Fetch the current user
      const userResponse = await axios.get('http://localhost:5074/api/Account/GetCurrentUser', {
        headers: {
          Authorization: `Bearer ${response.data.token}`
        }
      });

      localStorage.setItem('user', JSON.stringify(userResponse.data));
      setUser(userResponse.data);
      startSessionTimeout();
      return userResponse.data; // Return user data
    } catch (error) {
      console.error('Error logging in:', error);
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    clearSessionTimeout();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};