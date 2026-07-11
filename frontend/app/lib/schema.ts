import { z } from 'zod';

export const signInSchema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(6, "Password is required")
});

export const signUpSchema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    name: z.string().min(1, "Name is required"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters long")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
});