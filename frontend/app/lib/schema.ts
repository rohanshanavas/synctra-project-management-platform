import { z } from 'zod';
import { ProjectStatus } from '@/types';

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
    path: ["confirmPassword"],
    message: "Passwords do not match",
});

export const resetPasswordSchema = z.object({
    newPassword: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters long")
}).refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
});;

export const forgotPasswordSchema = z.object({
    email: z.email("Please enter a valid email address")
});

export const workspaceSchema = z.object({
    name: z.string().min(3, "Workspace name is required"),
    description: z.string().optional(),
    color: z.string().min(3, "Workspace color is required")
});

export const projectSchema = z.object({
    title: z.string().min(3, "Project title is required"),
    description: z.string().optional(),
    status: z.enum(ProjectStatus),
    startDate: z.string().min(10, "Start date is required"),
    dueDate: z.string().min(10, "Due date is required"),
    members: z.array(z.object({
        user: z.string(),
        role: z.enum(["admin", "member", "viewer", "owner"])
    })).optional(),
    tags: z.string().optional()
});