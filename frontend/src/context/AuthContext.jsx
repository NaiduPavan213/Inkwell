import React, { createContext , useState , useEffect } from 'react';

//create the cntext
export const AuthContext = createContext(null);

//create the provider component
export const AuthProvider = ({children}) =>{
    const [token , setToken] = useState(localStorage.getItem('token'));

    // This effect runs whenever the token state changes
    useEffect(() => {
        if(token){
            // If there's a token, store it in localStorage
            localStorage.setItem('token',token);
        }
        else {
            // If there's no token (e.g., on logout), remove it
            localStorage.removeItem('token');
        }
    }, [token]);

    const login = (newToken) => {
        setToken(newToken);
    };

    const logout = () => {
        setToken(null);
    };

    const contextValue = {
        token,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value = {contextValue}>
            {children}
        </AuthContext.Provider>
    );
};