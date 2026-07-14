import express from "express";
import z from "zod";
import { validateRequest } from "zod-express-middleware";
import { loginSchema, registerSchema } from "../libs/validateSchema.js";
import { loginUser, registerUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register",
    validateRequest({
        body: registerSchema
    }),
    registerUser
)

router.post("/login",
    validateRequest({
        body: loginSchema
    }),
    loginUser
)

export default router;