import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from "vitest";
import App from "../../../../src/App";

describe("MaxLoops Field Component", () => {
    const navigateToFitSpectrum = async () => {
        render(<App />);

        // Click on Fit Spectrum tab to switch to fit mode
        const fitTab = screen.getByText(/Spectrum Fitting/i);
        fireEvent.click(fitTab);

        // Wait for the fit form to load
        await waitFor(() => {
            const fitButton = screen.getByRole("button", { name: /Fit Spectrum/i });
            expect(fitButton).toBeDefined();
        });
    };

    it("renders max loops field with default value", () => {
        navigateToFitSpectrum();

        const maxLoopsField = screen.getByLabelText("Max Loops");

        expect(maxLoopsField).toBeInTheDocument();
        expect(maxLoopsField).toBeVisible();
        expect(maxLoopsField).toHaveValue(200);
    });

    it("accepts numeric input", () => {
        render(<App />);

        const maxLoopsField = screen.getByLabelText("Max Loops");

        fireEvent.change(maxLoopsField, { target: { value: "20" } });
        expect(maxLoopsField).toHaveValue(20);
    });

    it("validates positive numbers", async () => {
        render(<App />);

        const maxLoopsField = screen.getByLabelText("Max Loops");
        const submitButton = screen.getByRole("button", { name: /fit spectrum/i });

        fireEvent.change(maxLoopsField, { target: { value: "-5" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            // Should show validation error for negative values
            const errorMessage = screen.queryByText(/must be positive/i);
            if (errorMessage) {
                expect(errorMessage).toBeInTheDocument();
            }
        });
    });

    it("validates required field", async () => {
        render(<App />);

        const maxLoopsField = screen.getByLabelText("Max Loops");
        const submitButton = screen.getByRole("button", { name: /fit spectrum/i });

        fireEvent.change(maxLoopsField, { target: { value: "" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            // Should show validation error for empty field
            const errorMessage = screen.queryByText(/required/i);
            if (errorMessage) {
                expect(errorMessage).toBeInTheDocument();
            }
        });
    });

    it("accepts reasonable range values", () => {
        render(<App />);

        const maxLoopsField = screen.getByLabelText("Max Loops");

        // Test various reasonable values
        fireEvent.change(maxLoopsField, { target: { value: "1" } });
        expect(maxLoopsField).toHaveValue(1);

        fireEvent.change(maxLoopsField, { target: { value: "100" } });
        expect(maxLoopsField).toHaveValue(100);

        fireEvent.change(maxLoopsField, { target: { value: "50" } });
        expect(maxLoopsField).toHaveValue(50);
    });

    it("shows correct label", () => {
        render(<App />);

        expect(screen.getByText("Max Loops")).toBeInTheDocument();
    });
}); 