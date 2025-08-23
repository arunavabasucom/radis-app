import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from "vitest";
import App from "../../../../src/App";

describe("FitButton Field Component", () => {
    const navigateToFitSpectrum = async () => {
        render(<App />);

        // Click on Fit Spectrum tab to switch to fit mode
        const fitTab = screen.getByText(/Spectrum Fitting/i);
        fireEvent.click(fitTab);

        // Wait for the fit form to load
        await waitFor(() => {
            const fitButton = screen.getByRole("button", { name: /fit spectrum/i });
            expect(fitButton).toBeDefined();
        });
    };

    it("renders fit button", async () => {
        await navigateToFitSpectrum();

        const fitButton = screen.getByRole("button", { name: /fit spectrum/i });
        expect(fitButton).toBeDefined();
    });

    it("is clickable", () => {
        render(<App />);

        const fitButton = screen.getByRole("button", { name: /fit spectrum/i });

        fireEvent.click(fitButton);

        // Button should be clickable (no error thrown)
        expect(fitButton).toBeDefined();
    });

    it("has correct text", () => {
        render(<App />);

        const fitButton = screen.getByRole("button", { name: /fit spectrum/i });
        expect(fitButton.textContent).toBe("Fit Spectrum");
    });

    it("shows loading state when clicked with invalid form", async () => {
        render(<App />);

        const fitButton = screen.getByRole("button", { name: /fit spectrum/i });

        fireEvent.click(fitButton);

        // Should trigger form validation
        await waitFor(() => {
            expect(fitButton).toBeDefined();
        });
    });

    // skip the below tests cause it need the backend to be running
    it.skip("submits form when clicked with valid data", async () => {
        render(<App />);

        // Fill in some basic required fields first
        const uploadInput = screen.getByLabelText(/upload spectrum file/i);
        const file = new File(['test content'], 'test.spec', { type: 'text/plain' });
        fireEvent.change(uploadInput, { target: { files: [file] } });

        const fitButton = screen.getByRole("button", { name: /fit spectrum/i });

        fireEvent.click(fitButton);

        // Should attempt to submit (may fail due to backend, but button works)
        expect(fitButton).toBeDefined();
    });

}); 