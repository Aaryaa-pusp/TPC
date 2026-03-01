import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('jwtToken') || null);
    const [loading, setLoading] = useState(true); // for checking token on load

    useEffect(() => {
        if (token) {
            // Decode token or fetch user profile from an /api/auth/me route if it existed
            // For now, let's just parse the JWT payload or trust it
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUser(payload);
            } catch (e) {
                setToken(null);
                setUser(null);
                localStorage.removeItem('jwtToken');
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    }, [token]);

    const login = (newToken, userData) => {
        localStorage.setItem('jwtToken', newToken);
        setToken(newToken);
        setUser(userData); // Or decoded token
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        setToken(null);
        setUser(null);
    };

    const updateUser = (newUserData) => {
        setUser((prev) => ({ ...prev, ...newUserData }));
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
