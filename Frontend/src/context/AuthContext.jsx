import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/verify`, {
                    withCredentials: true,
                });
                if (res.data.success) {
                    setUser(res.data.user);
                }
            } catch (error) {
                console.log("Not logged in");
            } finally {
                setLoading(false);
            }
        };
        verifyUser();
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, {}, {
                withCredentials: true,
            });
            setUser(null);
        } catch (error) {
            console.error("Logout error", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
