import React, { createContext, useState, useEffect } from 'react';

// Helper functions for local storage
const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    console.log(`Saved user data to ${key}`, data);
    return true;
  } catch (error) {
    console.error(`Error saving user data to ${key}:`, error);
    return false;
  }
};

const loadFromLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      const data = JSON.parse(item);
      console.log(`Loaded user data from ${key}:`, data);
      return data;
    }
    return null;
  } catch (error) {
    console.error(`Error loading user data from ${key}:`, error);
    return null;
  }
};

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Initialize state with data from localStorage or null
  const [currentUser, setCurrentUser] = useState(() => loadFromLocalStorage('fencing_tracker_user'));

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      saveToLocalStorage('fencing_tracker_user', currentUser);
    } else {
      localStorage.removeItem('fencing_tracker_user');
    }
  }, [currentUser]);

  const login = (userData) => {
    setCurrentUser(userData);
    saveToLocalStorage('fencing_tracker_user', userData);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('fencing_tracker_user');
  };

  return (
    <UserContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};