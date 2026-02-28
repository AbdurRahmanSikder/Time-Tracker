import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return toast.error("Passwords do not match");
        }
        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, { email, password }, { withCredentials: true });
            if (res.data.success) {
                login(res.data.user);
                toast.success("Account created successfully");
                navigate("/");
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error("Signup failed. Check server.");
        }
    };

    return (
        <div className='w-full h-screen flex justify-center items-center'>
            <div className="bg-white text-gray-500 max-w-96 mx-4 md:p-6 p-4 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10">
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Create an account</h2>
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

                    <div className="relative w-full mt-1 mb-6 border border-gray-500/30 rounded-full focus-within:border-indigo-500 transition-colors bg-transparent flex items-center pr-3">
                        <input
                            id="confirm-password"
                            className="w-full bg-transparent outline-none py-2.5 pl-4 pr-2"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Re-Enter your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none flex-shrink-0 cursor-pointer"
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <button type="submit" className="w-full mb-3 bg-indigo-500 hover:bg-indigo-600 transition-colors py-2.5 rounded-full text-white font-medium shadow-md">
                        Sign up
                    </button>
                </form>
                <p className="text-center mt-4 text-gray-600">
                    Already have an account? <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
