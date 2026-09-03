import { describe, expect, test, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";

import SignIn from "@/routes/auth/sign-in";
import SignUp from "@/routes/auth/sign-up";

const mockMutate = vi.fn();
const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock("@/hooks/useAuth", () => ({
    useLoginMutation: () => ({
        mutate: mockMutate,
        isPending: false,
    }),

    useSignUpMutation: () => ({
        mutate: mockMutate,
        isPending: false,
    }),
}));

vi.mock("@/provider/authContext", () => ({
    useAuth: () => ({
        login: mockLogin,
    }),
}));

vi.mock("react-router", async () => {
    const actual = await vi.importActual<typeof import("react-router")>(
        "react-router"
    );

    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock("sonner", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

beforeEach(() => {
    vi.clearAllMocks();
});

describe("Sign In", () => {
    test("renders the sign-in form", () => {
        render(
            <MemoryRouter>
                <SignIn />
            </MemoryRouter>
        );

        expect(screen.getByText("Welcome Back!")).toBeInTheDocument();

        expect(
            screen.getByPlaceholderText("email@example.com")
        ).toBeInTheDocument();

        expect(
            screen.getByPlaceholderText("••••••••")
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: "Sign In" })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("link", { name: "Forgot Password?" })
        ).toHaveAttribute("href", "/forgot-password");
    });

    test("rejects a password shorter than 6 characters", async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <SignIn />
            </MemoryRouter>
        );

        await user.type(
            screen.getByPlaceholderText("email@example.com"),
            "test@example.com"
        );

        await user.type(
            screen.getByPlaceholderText("••••••••"),
            "123"
        );

        await user.click(screen.getByRole("button", { name: "Sign In" }));

        expect(
            screen.getByText("Password is required")
        ).toBeInTheDocument();

        expect(mockMutate).not.toHaveBeenCalled();
    });

    test("submits valid credentials", async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <SignIn />
            </MemoryRouter>
        );

        await user.type(
            screen.getByPlaceholderText("email@example.com"),
            "test@example.com"
        );

        await user.type(
            screen.getByPlaceholderText("••••••••"),
            "password123"
        );

        await user.click(screen.getByRole("button", { name: "Sign In" }));

        expect(mockMutate).toHaveBeenCalledTimes(1);

        expect(mockMutate).toHaveBeenCalledWith(
            {
                email: "test@example.com",
                password: "password123",
            },
            expect.objectContaining({
                onSuccess: expect.any(Function),
                onError: expect.any(Function),
            })
        );
    });
});

describe("Sign Up", () => {
    test("renders the sign-up form", () => {
        render(
            <MemoryRouter>
                <SignUp />
            </MemoryRouter>
        );

        expect(screen.getByText("Create an Account")).toBeInTheDocument();

        expect(
            screen.getByPlaceholderText("John Doe")
        ).toBeInTheDocument();

        expect(
            screen.getByPlaceholderText("email@example.com")
        ).toBeInTheDocument();

        expect(
            screen.getAllByPlaceholderText("••••••••")
        ).toHaveLength(2);

        expect(
            screen.getByRole("button", { name: "Sign Up" })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("link", { name: "Sign In" })
        ).toHaveAttribute("href", "/sign-in");
    });

    test("rejects mismatched passwords", async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <SignUp />
            </MemoryRouter>
        );

        await user.type(
            screen.getByPlaceholderText("John Doe"),
            "John Doe"
        );

        await user.type(
            screen.getByPlaceholderText("email@example.com"),
            "john@example.com"
        );

        const passwordInputs = screen.getAllByPlaceholderText("••••••••");

        await user.type(passwordInputs[0], "password123");
        await user.type(passwordInputs[1], "different123");

        await user.click(screen.getByRole("button", { name: "Sign Up" }));

        expect(
            screen.getByText("Passwords do not match")
        ).toBeInTheDocument();

        expect(mockMutate).not.toHaveBeenCalled();
    });

    test("submits valid registration data", async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <SignUp />
            </MemoryRouter>
        );

        await user.type(
            screen.getByPlaceholderText("John Doe"),
            "John Doe"
        );

        await user.type(
            screen.getByPlaceholderText("email@example.com"),
            "john@example.com"
        );

        const passwordInputs = screen.getAllByPlaceholderText("••••••••");

        await user.type(passwordInputs[0], "password123");
        await user.type(passwordInputs[1], "password123");

        await user.click(screen.getByRole("button", { name: "Sign Up" }));

        expect(mockMutate).toHaveBeenCalledTimes(1);

        expect(mockMutate).toHaveBeenCalledWith(
            {
                name: "John Doe",
                email: "john@example.com",
                password: "password123",
                confirmPassword: "password123",
            },
            expect.objectContaining({
                onSuccess: expect.any(Function),
                onError: expect.any(Function),
            })
        );
    });
});