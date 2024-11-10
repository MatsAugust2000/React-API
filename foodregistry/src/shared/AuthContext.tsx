import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from './AuthService';

interface AuthContextType {
    isAuthenticated: boolean;
    user: any | null;
    loading: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const initAuth = async () => {
            try {
                console.log('Fetching user info...'); // Debug log
                const userData = await authService.getCurrentUser();
                console.log('User data received:', userData); // Debug log
                setIsAuthenticated(userData.isAuthenticated);
                setUser(userData.user);
                setError(null);
            } catch (error) {
                console.error('Auth initialization failed:', error);
                setError('Failed to init auth');
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();

        // Add a second check after a short delay if coming from a redirect
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('returnUrl')) {
            setTimeout(initAuth, 1000); // Retry after 1 second
        }    
    }, []);

     // Debug log
     console.log('Auth state:', { isAuthenticated, user, loading, error });

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);