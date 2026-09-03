import { jest } from "@jest/globals";

const mockSendEmail = jest.fn().mockResolvedValue(true);

jest.unstable_mockModule("../libs/sendEmail.js", () => ({
    default: mockSendEmail,
}));

import request from "supertest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import app from "../app.js";

import User from "../models/user.js";
import Workspace from "../models/workspace.js";
import Project from "../models/project.js";
import Task from "../models/task.js";
import Verification from "../models/verification.js";


/*
|--------------------------------------------------------------------------
| Test Helpers
|--------------------------------------------------------------------------
|
| These helpers keep the actual tests short and readable.
| They create the database records required by each integration test.
|
*/

const createUser = async ({
    name = "Test User",
    email = "test@example.com",
    password = "password123",
    isEmailVerified = true,
} = {}) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    return User.create({
        name,
        email,
        password: hashedPassword,
        isEmailVerified,
    });
};


const createToken = (userId, options = {}) => {
    return jwt.sign(
        {
            userId,
            purpose: "login",
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h",
            ...options,
        }
    );
};


const createWorkspace = async (user, overrides = {}) => {
    return Workspace.create({
        name: "Test Workspace",
        description: "Workspace for testing",
        color: "#3b82f6",

        owner: user._id,

        members: [
            {
                user: user._id,
                role: "owner",
            },
        ],

        ...overrides,
    });
};


const createProject = async (user, workspace, overrides = {}) => {
    return Project.create({
        title: "Test Project",
        description: "Project for testing",

        status: "Planning",

        startDate: new Date("2026-09-01"),
        dueDate: new Date("2026-09-30"),

        tags: [],

        workspace: workspace._id,

        members: [
            {
                user: user._id,
                role: "Contributor",
            },
        ],

        createdBy: user._id,

        ...overrides,
    });
};


const createTask = async (user, project, overrides = {}) => {
    return Task.create({
        title: "Test Task",
        description: "Task for testing",

        status: "To Do",
        priority: "Medium",

        dueDate: new Date("2026-09-30"),

        assignees: [user._id],

        project: project._id,

        createdBy: user._id,

        ...overrides,
    });
};


/*
|--------------------------------------------------------------------------
| Application
|--------------------------------------------------------------------------
*/

describe("Application", () => {

    test("GET / - returns the Synctra welcome message", async () => {

        const response = await request(app)
            .get("/");

        expect(response.statusCode).toBe(200);

        expect(response.body).toEqual({
            message: "Welcome to Synctra API",
        });
    });


    test("GET /unknown-route - returns 404", async () => {

        const response = await request(app)
            .get("/this-route-does-not-exist");

        expect(response.statusCode).toBe(404);

        expect(response.body).toEqual({
            message: "API not found",
        });
    });

});


/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

describe("Authentication", () => {

    test("POST /auth/register - rejects invalid registration data", async () => {

        const response = await request(app)
            .post("/api-v1/auth/register")
            .send({
                name: "Test User",
                email: "not-an-email",
                password: "123",
            });

        expect(response.statusCode).toBe(400);
    });


    test("POST /auth/register - successfully registers a user", async () => {

        const response = await request(app)
            .post("/api-v1/auth/register")
            .send({
                name: "Test User",
                email: "register@example.com",
                password: "password123",
            });

        expect(response.statusCode).toBe(201);

        expect(response.body).toEqual({
            message:
                "Verification email sent. Please check and verify your account.",
        });

        const user = await User.findOne({
            email: "register@example.com",
        });

        expect(user).not.toBeNull();
        expect(user.name).toBe("Test User");

        // Password should be stored hashed rather than plain text.
        expect(user.password).not.toBe("password123");
    });


    test("POST /auth/login - successfully logs in a verified user", async () => {

        const user = await createUser({
            name: "Login User",
            email: "login@example.com",
        });

        const response = await request(app)
            .post("/api-v1/auth/login")
            .send({
                email: user.email,
                password: "password123",
            });

        expect(response.statusCode).toBe(200);

        expect(response.body.message).toBe("Login Successful");

        expect(response.body.token).toBeDefined();

        expect(response.body.user).toBeDefined();

        expect(response.body.user.email).toBe(user.email);

        expect(response.body.user.name).toBe(user.name);

        // Password should never be returned to the client.
        expect(response.body.user.password).toBeUndefined();

        // Login should update the user's last login time.
        expect(response.body.user.lastLogin).toBeDefined();
    });


    test("POST /auth/login - rejects an incorrect password", async () => {

        await createUser({
            email: "wrong-password@example.com",
        });

        const response = await request(app)
            .post("/api-v1/auth/login")
            .send({
                email: "wrong-password@example.com",
                password: "wrongpassword",
            });

        expect(response.statusCode).toBe(400);

        expect(response.body).toEqual({
            message: "Invalid email or password",
        });
    });


    test("POST /auth/verify-email - successfully verifies an email", async () => {

        const user = await createUser({
            email: "verify@example.com",
            isEmailVerified: false,
        });

        const verificationToken = jwt.sign(
            {
                userId: user._id,
                purpose: "email-verification",
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
            }
        );

        await Verification.create({
            userId: user._id,
            token: verificationToken,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        });


        const response = await request(app)
            .post("/api-v1/auth/verify-email")
            .send({
                token: verificationToken,
            });


        expect(response.statusCode).toBe(200);

        expect(response.body).toEqual({
            message: "Email verified successfully",
        });


        const updatedUser = await User.findById(user._id);

        expect(updatedUser.isEmailVerified).toBe(true);


        // Verification token should be deleted after successful verification.
        const verification = await Verification.findOne({
            userId: user._id,
        });

        expect(verification).toBeNull();
    });

});


/*
|--------------------------------------------------------------------------
| Authentication Middleware
|--------------------------------------------------------------------------
*/

describe("Authentication Middleware", () => {

    test("allows an authenticated request with a valid JWT", async () => {

        const user = await createUser({
            email: "middleware@example.com",
        });

        const token = createToken(user._id);


        const response = await request(app)
            .get("/api-v1/workspaces")
            .set("Authorization", `Bearer ${token}`);


        /*
         * We are checking that authentication succeeds.
         *
         * The endpoint itself can return an empty array,
         * but it should not reject the request with 401.
         */
        expect(response.statusCode).not.toBe(401);
    });


    test("rejects an expired JWT", async () => {

        const user = await createUser({
            email: "expired@example.com",
        });

        const token = jwt.sign(
            {
                userId: user._id,
                purpose: "login",
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "-1s",
            }
        );


        const response = await request(app)
            .get("/api-v1/workspaces")
            .set("Authorization", `Bearer ${token}`);


        expect(response.statusCode).toBe(401);

        expect(response.body).toEqual({
            message: "Token expired",
        });
    });

});


/*
|--------------------------------------------------------------------------
| Workspaces
|--------------------------------------------------------------------------
*/

describe("Workspaces", () => {

    test("POST /workspaces - creates a workspace for an authenticated user", async () => {

        const user = await createUser({
            email: "workspace-owner@example.com",
        });

        const token = createToken(user._id);


        const response = await request(app)
            .post("/api-v1/workspaces")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "My Workspace",
                description: "My workspace description",
                color: "#3b82f6",
            });


        expect(response.statusCode).toBe(201);

        expect(response.body.name).toBe("My Workspace");

        expect(response.body.description).toBe(
            "My workspace description"
        );

        expect(response.body.color).toBe("#3b82f6");

        expect(response.body.owner.toString()).toBe(
            user._id.toString()
        );


        expect(response.body.members).toHaveLength(1);

        expect(
            response.body.members[0].user.toString()
        ).toBe(user._id.toString());

        expect(response.body.members[0].role).toBe("owner");


        // Confirm that the workspace actually exists in MongoDB.
        const workspace = await Workspace.findById(
            response.body._id
        );

        expect(workspace).not.toBeNull();

        expect(workspace.name).toBe("My Workspace");
    });


    test("GET /workspaces - returns only workspaces the user belongs to", async () => {

        const user = await createUser({
            email: "workspace-user@example.com",
        });

        const otherUser = await createUser({
            email: "other-user@example.com",
        });


        await createWorkspace(user, {
            name: "My Workspace",
        });

        await createWorkspace(otherUser, {
            name: "Other Workspace",
        });


        const token = createToken(user._id);


        const response = await request(app)
            .get("/api-v1/workspaces")
            .set("Authorization", `Bearer ${token}`);


        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveLength(1);

        expect(response.body[0].name).toBe(
            "My Workspace"
        );
    });


    test("PUT /workspaces/:workspaceId - prevents a non-owner from updating a workspace", async () => {

        const owner = await createUser({
            email: "owner@example.com",
        });

        const member = await createUser({
            email: "member@example.com",
        });


        const workspace = await createWorkspace(owner, {
            members: [
                {
                    user: owner._id,
                    role: "owner",
                },
                {
                    user: member._id,
                    role: "member",
                },
            ],
        });


        const memberToken = createToken(member._id);


        const response = await request(app)
            .put(`/api-v1/workspaces/${workspace._id}`)
            .set(
                "Authorization",
                `Bearer ${memberToken}`
            )
            .send({
                name: "Changed Workspace Name",
            });


        expect(response.statusCode).toBe(403);

        expect(response.body).toEqual({
            message:
                "Only workspace owner can update workspace settings",
        });
    });

});


/*
|--------------------------------------------------------------------------
| Projects
|--------------------------------------------------------------------------
*/

describe("Projects", () => {

    test("POST /projects/:workspaceId/create-project - creates a project", async () => {

        const user = await createUser({
            email: "project-owner@example.com",
        });

        const workspace = await createWorkspace(user);

        const token = createToken(user._id);


        const response = await request(app)
            .post(
                `/api-v1/projects/${workspace._id}/create-project`
            )
            .set(
                "Authorization",
                `Bearer ${token}`
            )
            .send({
                title: "New Project",
                description: "Project description",
                status: "Planning",
                startDate: "2026-09-01",
                dueDate: "2026-09-30",
                tags: "backend,devops",

                members: [
                    {
                        user: user._id.toString(),
                        role: "Contributor",
                    },
                ],
            });


        expect(response.statusCode).toBe(201);

        expect(response.body.title).toBe(
            "New Project"
        );

        expect(response.body.workspace.toString()).toBe(
            workspace._id.toString()
        );

        expect(response.body.createdBy.toString()).toBe(
            user._id.toString()
        );


        // Confirm that the project was added to the workspace.
        const updatedWorkspace = await Workspace.findById(
            workspace._id
        );

        expect(
            updatedWorkspace.projects
                .map((id) => id.toString())
                .includes(response.body._id.toString())
        ).toBe(true);
    });


    test("POST /projects/:workspaceId/create-project - rejects a non-member", async () => {

        const owner = await createUser({
            email: "project-workspace-owner@example.com",
        });

        const outsider = await createUser({
            email: "project-outsider@example.com",
        });


        const workspace = await createWorkspace(owner);

        const token = createToken(outsider._id);


        const response = await request(app)
            .post(
                `/api-v1/projects/${workspace._id}/create-project`
            )
            .set(
                "Authorization",
                `Bearer ${token}`
            )
            .send({
                title: "Unauthorized Project",
                description: "Should not be created",
                status: "Planning",
                startDate: "2026-09-01",
                dueDate: "2026-09-30",
                tags: "",
                members: [],
            });


        expect(response.statusCode).toBe(403);

        expect(response.body).toEqual({
            message:
                "You are not a member of this workspace",
        });
    });

});


/*
|--------------------------------------------------------------------------
| Tasks
|--------------------------------------------------------------------------
*/

describe("Tasks", () => {

    test("POST /tasks/:projectId/create-task - creates a task", async () => {

        const user = await createUser({
            email: "task-owner@example.com",
        });

        const workspace = await createWorkspace(user);

        const project = await createProject(
            user,
            workspace
        );

        const token = createToken(user._id);


        const response = await request(app)
            .post(
                `/api-v1/tasks/${project._id}/create-task`
            )
            .set(
                "Authorization",
                `Bearer ${token}`
            )
            .send({
                title: "Implement authentication",
                description: "Build JWT authentication",
                status: "To Do",
                priority: "High",
                dueDate: "2026-09-25",

                // taskSchema requires at least one assignee
                assignees: [
                    user._id.toString(),
                ],
            });


        expect(response.statusCode).toBe(201);

        expect(response.body.title).toBe(
            "Implement authentication"
        );

        expect(response.body.status).toBe("To Do");

        expect(response.body.priority).toBe("High");

        expect(response.body.project.toString()).toBe(
            project._id.toString()
        );

        expect(response.body.createdBy.toString()).toBe(
            user._id.toString()
        );


        // Confirm that the task was added to the project.
        const updatedProject = await Project.findById(
            project._id
        );

        expect(
            updatedProject.tasks
                .map((id) => id.toString())
                .includes(response.body._id.toString())
        ).toBe(true);
    });


    test("PUT /tasks/:taskId/status - updates task status", async () => {

        const user = await createUser({
            email: "task-status@example.com",
        });

        const workspace = await createWorkspace(user);

        const project = await createProject(
            user,
            workspace
        );

        const task = await createTask(
            user,
            project
        );

        const token = createToken(user._id);


        const response = await request(app)
            .put(
                `/api-v1/tasks/${task._id}/status`
            )
            .set(
                "Authorization",
                `Bearer ${token}`
            )
            .send({
                status: "Done",
            });


        expect(response.statusCode).toBe(200);

        expect(response.body.status).toBe("Done");


        // Verify persistence in MongoDB.
        const updatedTask = await Task.findById(
            task._id
        );

        expect(updatedTask.status).toBe("Done");
    });


    test("POST /tasks/:projectId/create-task - rejects a non-workspace member", async () => {

        const owner = await createUser({
            email: "task-project-owner@example.com",
        });

        const outsider = await createUser({
            email: "task-outsider@example.com",
        });


        const workspace = await createWorkspace(owner);

        const project = await createProject(
            owner,
            workspace
        );

        const token = createToken(outsider._id);


        const response = await request(app)
            .post(
                `/api-v1/tasks/${project._id}/create-task`
            )
            .set(
                "Authorization",
                `Bearer ${token}`
            )
            .send({
                title: "Unauthorized Task",
                description: "Should not be created",
                status: "To Do",
                priority: "Low",
                dueDate: "2026-09-25",
                assignees: [
                    outsider._id.toString(),
                ],
            });


        expect(response.statusCode).toBe(403);

        expect(response.body).toEqual({
            message:
                "You are not a member of this workspace",
        });
    });


    test("POST /tasks/:projectId/create-task - rejects invalid task data", async () => {

        const user = await createUser({
            email: "invalid-task@example.com",
        });

        const workspace = await createWorkspace(user);

        const project = await createProject(
            user,
            workspace
        );

        const token = createToken(user._id);


        const response = await request(app)
            .post(
                `/api-v1/tasks/${project._id}/create-task`
            )
            .set(
                "Authorization",
                `Bearer ${token}`
            )
            .send({
                title: "AB",
                status: "Invalid Status",
                priority: "Invalid Priority",
                dueDate: "",
                assignees: [],
            });


        expect(response.statusCode).toBe(400);
    });

});