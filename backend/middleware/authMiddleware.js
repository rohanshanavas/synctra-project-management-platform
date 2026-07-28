import jwt from "jsonwebtoken";
import User from "../models/user.js";

const authMiddleware = async (req, res, next) => {

    try {

        const token = req.headers.authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Token unauthorized" });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedToken.userId);

        if (!user) {
            return res.status(401).json({ message: "User unauthorized" });
        }

        req.user = user;
        next();

    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }

};

export default authMiddleware;