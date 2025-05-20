import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './use-toast';

// Define user roles
export type UserRole = 'admin' | 'consumer' | 'manufacturer' | 'distributor' | 'retailer';

// Define user interface
export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
  email: string;
}

// Define context interface
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (username: string, password: string, name: string, email: string, role: UserRole) => Promise<void>;
  verifyRole: (requiredRole: UserRole | UserRole[]) => boolean;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | null>(null);

// Create the provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('indalo_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('indalo_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call to authenticate
      // For demo purposes, we'll mock the API call
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock users for demo
      const mockUsers: Record<string, User> = {
        'admin': {
          id: '1',
          username: 'admin',
          role: 'admin',
          name: 'System Administrator',
          email: 'admin@indalosolutions.co.za'
        },
        'manufacturer': {
          id: '2',
          username: 'manufacturer',
          role: 'manufacturer',
          name: 'Production Manager',
          email: 'production@indalosolutions.co.za'
        },
        'distributor': {
          id: '3',
          username: 'distributor',
          role: 'distributor',
          name: 'Distribution Manager',
          email: 'distribution@indalosolutions.co.za'
        },
        'retailer': {
          id: '4',
          username: 'retailer',
          role: 'retailer',
          name: 'Retail Manager',
          email: 'retail@indalosolutions.co.za'
        },
        'consumer': {
          id: '5',
          username: 'consumer',
          role: 'consumer',
          name: 'John Smith',
          email: 'consumer@example.com'
        }
      };
      
      // Check if user exists (in a real app, this would check credentials too)
      if (mockUsers[username] && password === 'password') { // Fixed password for demo
        const loggedInUser = mockUsers[username];
        setUser(loggedInUser);
        localStorage.setItem('indalo_user', JSON.stringify(loggedInUser));
        
        toast({
          title: 'Login Successful',
          description: `Welcome back, ${loggedInUser.name}!`,
        });
      } else {
        throw new Error('Invalid username or password');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
      toast({
        title: 'Login Failed',
        description: err.message || 'An error occurred during login',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, this would call an API endpoint to invalidate the session
      // For demo, we just clear local storage
      localStorage.removeItem('indalo_user');
      setUser(null);
      
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out',
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred during logout');
      toast({
        title: 'Logout Failed',
        description: err.message || 'An error occurred during logout',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (
    username: string,
    password: string,
    name: string,
    email: string,
    role: UserRole
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would call an API to register the user
      // For demo, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new user object
      const newUser: User = {
        id: Date.now().toString(), // Generate random ID
        username,
        role,
        name,
        email
      };
      
      // Set as current user and store in localStorage
      setUser(newUser);
      localStorage.setItem('indalo_user', JSON.stringify(newUser));
      
      toast({
        title: 'Registration Successful',
        description: `Welcome, ${name}!`,
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
      toast({
        title: 'Registration Failed',
        description: err.message || 'An error occurred during registration',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Verify if user has the required role
  const verifyRole = (requiredRole: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }
    
    return user.role === requiredRole || user.role === 'admin'; // Admin has access to everything
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        logout,
        register,
        verifyRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default useAuth;