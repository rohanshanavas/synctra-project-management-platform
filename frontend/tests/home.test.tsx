import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import Home from "@/routes/root/home";

describe("Home page", () => {
    test("renders the main Synctra landing page content", () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        const logo = screen.getByAltText("Synctra Logo");

        expect(logo).toBeInTheDocument();
        expect(logo.closest("a")).toHaveAttribute("href", "/");

        // Hero
        expect(
            screen.getByText("Everything your team needs to")
        ).toBeInTheDocument();

        expect(
            screen.getByText("stay in sync.")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Simple project management")
        ).toBeInTheDocument();

        // Features / workflow
        expect(
            screen.getByText("Keep the whole workflow in one place.")
        ).toBeInTheDocument();

        expect(
            screen.getByText("From workspace to completed project.")
        ).toBeInTheDocument();

        // Dashboard preview
        expect(
            screen.getByText("Task Trends")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Workspace Productivity")
        ).toBeInTheDocument();
    });

    test("renders the main navigation links", () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        expect(
            screen.getByRole("link", { name: "Dashboard" })
        ).toHaveAttribute("href", "#dashboard");

        expect(
            screen.getByRole("link", { name: "Features" })
        ).toHaveAttribute("href", "#features");

        expect(
            screen.getByRole("link", { name: "How it works" })
        ).toHaveAttribute("href", "#workflow");
    });

    test("renders sign-in and sign-up calls to action", () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        expect(
            screen.getAllByRole("link", { name: "Sign in" })
        ).not.toHaveLength(0);

        expect(
            screen.getAllByRole("link", { name: /Get started/i })
        ).not.toHaveLength(0);

        expect(
            screen.getByRole("link", { name: /Start using Synctra/i })
        ).toHaveAttribute("href", "/sign-up");
    });
});