import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/db.js";
import User from "../entities/User.js";

const generateToken = (id, email) => {
    return jwt.sign({ id, email }, process.env.JWT_SECRET || "default_secret", {
        expiresIn: "30d",
    });
};

export const signup = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ success: false, message: "Please provide email and password" });
        }

        const userRepository = AppDataSource.getRepository(User);

        // Check if user exists
        const userExists = await userRepository.findOneBy({ email });
        if (userExists) {
            return res.json({ success: false, message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = userRepository.create({
            email,
            password: hashedPassword,
        });
        const savedUser = await userRepository.save(newUser);

        // Generate token
        const token = generateToken(savedUser.id, savedUser.email);

        res.json({
            success: true,
            message: "User registered successfully",
            token,
            user: { id: savedUser.id, email: savedUser.email }
        });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ success: false, message: "Please provide email and password" });
        }

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ email });

        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken(user.id, user.email);



        res.json({
            success: true,
            message: "Logged in successfully",
            token,
            user: { id: user.id, email: user.email }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const logout = (req, res) => {
    res.json({ success: true, message: "Logged out successfully" });
};

export const verify = (req, res) => {
    // If authMiddleware passed, req.user exists
    res.json({ success: true, user: { id: req.user.id, email: req.user.email } });
};
