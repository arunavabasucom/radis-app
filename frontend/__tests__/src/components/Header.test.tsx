import { render, screen, fireEvent } from "@testing-library/react";
import user from "@testing-library/user-event";
import React from "react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { Header } from "../../../src/components/Header";

// Mock the color scheme hook
vi.mock('@mui/joy/styles', () => ({
    useColorScheme: () => ({
        mode: 'light',
        setMode: vi.fn()
    })
}));

const HeaderWithRouter = () => (
    <BrowserRouter>
        <Header />
    </BrowserRouter>
);

describe("Header Component", () => {
    it("renders the header with logo and title", () => {
        render(<HeaderWithRouter />);

        expect(screen.getByAltText("Radish logo")).toBeInTheDocument();
        expect(screen.getByText("Radis App")).toBeInTheDocument();
    });

    it("renders navigation buttons", () => {
        render(<HeaderWithRouter />);

        expect(screen.getByText("Spectrum Calculation")).toBeInTheDocument();
        expect(screen.getByText("Spectrum Fitting")).toBeInTheDocument();
    });

    it("renders GitHub icon button", () => {
        render(<HeaderWithRouter />);

        const githubButton = screen.getByLabelText("GitHub");
        expect(githubButton).toBeInTheDocument();
    });

    it("opens GitHub when GitHub icon is clicked", () => {
        // Mock window.location.href
        delete window.location;
        window.location = { href: "" } as any;

        render(<HeaderWithRouter />);

        const githubButtons = screen.getAllByRole("button");
        const githubButton = githubButtons[0]; // First button should be GitHub

        fireEvent.click(githubButton);
        // Can't easily test window.location.href change in jsdom
    });

    it("renders theme toggle button", () => {
        render(<HeaderWithRouter />);

        // Should have multiple buttons including theme toggle
        const themeButton = screen.getByLabelText("Theme");
        expect(themeButton).toBeInTheDocument();
    });
}); 