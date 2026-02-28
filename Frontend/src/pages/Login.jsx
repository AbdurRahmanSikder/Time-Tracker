import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    // Load saved credentials on mount
    useEffect(() => {
        const savedEmail = localStorage.getItem('timeTrackerEmail');
        const savedPassword = localStorage.getItem('timeTrackerPassword');
        if (savedEmail && savedPassword) {
            setEmail(savedEmail);
            setPassword(savedPassword);
            setRememberMe(true);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, { email, password }, { withCredentials: true });
            if (res.data.success) {
                // Handle Remember Me
                if (rememberMe) {
                    localStorage.setItem('timeTrackerEmail', email);
                    localStorage.setItem('timeTrackerPassword', password);
                } else {
                    localStorage.removeItem('timeTrackerEmail');
                    localStorage.removeItem('timeTrackerPassword');
                }
                login(res.data.user);
                toast.success("Logged in successfully");
                navigate("/");
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error("Login failed. Check server.");
        }
    };

    return (
        <div className='w-full h-screen flex justify-center items-center'>
            <div className="bg-white text-gray-500 max-w-96 mx-4 md:p-6 p-4 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10">
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Welcome back</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        id="email"
                        className="w-full bg-transparent border my-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4 focus:border-indigo-500 transition-colors"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <div className="relative w-full mt-1 mb-4 border border-gray-500/30 rounded-full focus-within:border-indigo-500 transition-colors bg-transparent flex items-center pr-3">
                        <input
                            id="password"
                            className="w-full bg-transparent outline-none py-2.5 pl-4 pr-2"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none flex-shrink-0 cursor-pointer"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <div className="flex items-center mb-6 pl-2">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                        />
                        <label htmlFor="rememberMe" className="ml-2 text-sm font-medium text-gray-600 cursor-pointer">
                            Remember me
                        </label>
                    </div>

                    <button type="submit" className="w-full mb-3 bg-indigo-500 py-2.5 rounded-full text-white font-medium hover:bg-indigo-600 transition-colors shadow-md">
                        Log in
                    </button>
                </form>
                <p className="text-center mt-4 text-gray-600">
                    Don’t have an account? <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
