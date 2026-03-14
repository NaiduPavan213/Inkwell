import React, { createContext, useState, useEffect, ReactNode } from 'react';

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

    // This effect runs whenever the token state changes
    useEffect(() => {
        if (token) {
            // If there's a token, store it in localStorage
            localStorage.setItem('token', token);
        }
        else {
            // If there's no token (e.g., on logout), remove it
            localStorage.removeItem('token');
        }
    }, [token]);

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
