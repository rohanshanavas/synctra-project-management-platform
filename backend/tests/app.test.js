import request from "supertest";
import app from "../app.js";

describe("GET /", () => {
    it("should return the Synctra welcome message", async () => {
        const response = await request(app).get("/");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            message: "Welcome to Synctra API",
        });
    });
});

describe("Unknown routes", () => {
    it("should return 404 for an unknown route", async () => {
        const response = await request(app).get("/this-route-does-not-exist");

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({
            message: "API not found",
        });
    });
});

describe("POST /api-v1/auth/register", () => {
    it("should reject an invalid email", async () => {
        const response = await request(app)
            .post("/api-v1/auth/register")
            .send({
                name: "Test User",
                email: "not-an-email",
                password: "password123",
            });

        expect(response.statusCode).toBe(400);
    });

    it("should reject a password shorter than 8 characters", async () => {
        const response = await request(app)
            .post("/api-v1/auth/register")
            .send({
                name: "Test User",
                email: "test@example.com",
                password: "123",
            });

        expect(response.statusCode).toBe(400);
    });

    it("should reject a request without a name", async () => {
        const response = await request(app)
            .post("/api-v1/auth/register")
            .send({
                email: "test@example.com",
                password: "password123",
            });

        expect(response.statusCode).toBe(400);
    });
});

describe("POST /api-v1/auth/login", () => {
    it("should reject an invalid email", async () => {
        const response = await request(app)
            .post("/api-v1/auth/login")
            .send({
                email: "invalid-email",
                password: "password123",
            });

        expect(response.statusCode).toBe(400);
    });

    it("should reject a short password", async () => {
        const response = await request(app)
            .post("/api-v1/auth/login")
            .send({
                email: "test@example.com",
                password: "123",
            });

        expect(response.statusCode).toBe(400);
    });
});