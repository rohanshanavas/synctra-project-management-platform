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
        role: z.enum(["Manager", "Contributor", "Viewer"])
    })).optional(),
    tags: z.string().optional()
});

export const createTaskSchema = z.object({
    title: z.string().min(3, "Task title is required"),
    description: z.string().optional(),
    status: z.enum(["To Do", "In Progress", "Done"]),
    priority: z.enum(["Low", "Medium", "High"]),
    dueDate: z.string().min(1, "Due date is required"),
    assignees: z.array(z.string()).min(1, "At least one assignee is required")
});

export const inviteMemberSchema = z.object({
    email: z.email("Please enter a valid email address"),
    role: z.enum(["viewer", "admin", "member"], "Please select a valid role")
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters long"),
    confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters long")
}).refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
});

export const profileSchema = z.object({
    name: z.string().min(1, "Name is required"),
    profilePicture: z.string().optional()
});