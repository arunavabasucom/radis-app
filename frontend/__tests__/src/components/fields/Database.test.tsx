import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import user from "@testing-library/user-event";
import React from "react";
import { describe, it, expect } from "vitest";
import App from "../../../../src/App";

describe("Database Field Component", () => {
    it("renders database field with default value", () => {
        render(<App />);

        const databaseField = screen.getByTestId("database-testid");
        expect(databaseField).toBeInTheDocument();
        expect(databaseField).toBeVisible();
    });

    it("has hitran as default selection", () => {
        render(<App />);

        const databaseField = screen.getByTestId("database-testid");
        expect(databaseField).toHaveTextContent("HITRAN");
    });

    it("can select different database options", async () => {
        render(<App />);

        const databaseField = screen.getByTestId("database-testid");

        // Click to open dropdown
        fireEvent.mouseDown(databaseField);

        await waitFor(() => {
            // Should show database options
            expect(screen.getByText("HITEMP")).toBeInTheDocument();
        });
    });

    it("can switch to hitemp database", async () => {
        render(<App />);

        const databaseField = screen.getByTestId("database-testid");

        // Click to open dropdown
        fireEvent.mouseDown(databaseField);

        await waitFor(() => {
            const hitempOption = screen.getByText("HITEMP");
            fireEvent.click(hitempOption);
        });

        await waitFor(() => {
            expect(databaseField).toHaveTextContent("HITEMP");
        });
    });

    it("shows correct database options", async () => {
        render(<App />);

        const databaseField = screen.getByTestId("database-testid");

        // Click to open dropdown
        fireEvent.mouseDown(databaseField);

        await waitFor(() => {
            expect(screen.getByText("HITEMP")).toBeInTheDocument();
            expect(screen.getByText("EXOMOL")).toBeInTheDocument();
            expect(screen.getByText("GEISA")).toBeInTheDocument();
        });
    });
}); 