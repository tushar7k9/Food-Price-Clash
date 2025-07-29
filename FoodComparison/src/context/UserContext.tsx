import React, { createContext, useContext, useState, ReactNode } from 'react';

type Location = {
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
};

type User = {
  id?: string;
  name?: string;
  email?: string;
  location?: Location;
};

type UserContextType = {
  user: User | null;
  isLoggedIn: boolean;
  login: (userData: Partial<User>) => void;
  logout: () => void;
  updateLocation: (location: Location) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const isLoggedIn = user !== null;

  const login = (userData: Partial<User>) => {
    setUser({
      id: 'user123',
      ...userData
    });
  };

  const logout = () => {
    setUser(null);
  };

  const updateLocation = (location: Location) => {
    if (user) {
      setUser({
        ...user,
        location
      });
    } else {
      // For non-logged in users, we still want to track location
      setUser({
        location
      });
    }
  };

  return (
    <UserContext.Provider value={{ user, isLoggedIn, login, logout, updateLocation }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};