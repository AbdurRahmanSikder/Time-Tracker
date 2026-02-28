import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "Not authorized, no token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
        req.user = decoded; // Contains id and email
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(401).json({ success: false, message: "Not authorized, token failed" });
    }
};
