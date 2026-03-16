import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface AuthContextType {
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
}

// create the context
export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

// create the provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    // Set default base URL for local/prod
    axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    // This effect runs whenever the token state changes
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        }
        else {
            localStorage.removeItem('token');
        }
    }, [token]);

    // Global interceptor for session expiration
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                // If backend returns 401 (Unauthorized), it means token is invalid or expired
                if (error.response && error.response.status === 401) {
                    logout();
                    window.location.href = '/login'; // Force redirect to login
                }
                return Promise.reject(error);
            }
        );

        return () => axios.interceptors.response.eject(interceptor);
    }, []);

    const login = (newToken: string) => {
        setToken(newToken);
    };

    const logout = () => {
        setToken(null);
    };

    const contextValue: AuthContextType = {
        token,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
