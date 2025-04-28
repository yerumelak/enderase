import { createContext, useContext, useState, useEffect } from "react";
import api from "./api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));

    // You can use this to check if the user is logged in on initial load
    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Check if there's a saved user (you can fetch it from localStorage or an API)
                const token = localStorage.getItem('access_token');
                if (token) {
                    api.defaults.headers.Authorization = `Bearer ${token}`;
                    const response = await api.get('/api/user');  // Adjust the URL to get the user info
                    localStorage.setItem('user', JSON.stringify(response.data));
                    setUser(response.data);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    // Login function
    const login = async (email, password) => {
        try {
            const response = await api.post('/api/token/', { email, password });
            const { access, refresh } = response.data;  // Assuming you're using JWTs
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            api.defaults.headers.Authorization = `Bearer ${access}`;
            setUser(await getUserData());
            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
    };

    // Fetch user data
    const getUserData = async () => {
        try {
            const response = await api.get('/api/user');
            console.log(response);
            localStorage.setItem('user', JSON.stringify(response.data));
            return response.data;
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };
    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
