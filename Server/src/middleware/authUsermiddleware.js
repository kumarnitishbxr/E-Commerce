import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token provided" });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        req.userId = decoded.id;
        req.refreshToken = refreshToken;

        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: "Invalid or expired refresh token" });
    }
};

export default authMiddleware;
