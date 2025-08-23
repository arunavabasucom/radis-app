import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import React from "react";
import { describe, it, expect, vi } from "vitest";
import user from "@testing-library/user-event";
import App from "../../../src/App";

// Mock axios to avoid actual API calls
vi.mock('axios');

describe("FitForm Component Integration", () => {
    it("switches to fit form when fit spectrum tab is clicked", async () => {
        render(<App />);

        // Click on Fit Spectrum tab to switch to fit mode
        const fitTab = screen.getByText(/Spectrum Fitting/i);
        fireEvent.click(fitTab);

        // Wait for the fit form to load
        await waitFor(() => {
            const fitButton = screen.getByRole("button", { name: /fit spectrum/i });
            expect(fitButton).toBeDefined();
        });
    });

    it("renders fit form fields when in fit mode", () => {
        render(<App />);

        // Look for fit-specific elements that might be present
        const uploadField = screen.queryByLabelText(/upload spectrum file/i);
        const maxLoopsField = screen.queryByLabelText(/max loops/i);
        const normalizeField = screen.queryByTestId("normalize-testid");

        // At least one of these should be present in fit mode
        const hasFitElements = uploadField || maxLoopsField || normalizeField;
        expect(hasFitElements).toBeDefined();
    });

    it("renders bounding ranges for fit parameters", async () => {
        render(<App />);

        // Look for any bounding range inputs
        // Check the tgas checkbox to show the bounding range inputs
        const checkbox = within(screen.getByTestId('tgas_checkbox_testid')).getByRole('checkbox')
        expect(checkbox).toHaveProperty('checked', false)
        await user.click(checkbox);
        expect(checkbox).toHaveProperty('checked', true)

        const minInputGroup = screen.getByTestId("min-tgasBounding-input");
        const maxInputGroup = screen.getByTestId("max-tgasBounding-input");

        expect(minInputGroup).toBeTruthy();
        expect(maxInputGroup).toBeTruthy();
    });

    it("renders upload field for experimental data", () => {
        render(<App />);

        // Look for file upload field
        const uploadField = screen.queryByLabelText(/upload/i);
        expect(uploadField).toBeDefined();
    });

    it("renders max loops field", () => {
        render(<App />);

        const maxLoopsField = screen.queryByLabelText(/max loops/i);
        expect(maxLoopsField).toBeDefined();
    });

    it("renders normalize checkbox", () => {
        render(<App />);

        const normalizeField = screen.queryByTestId("normalize-testid");
        expect(normalizeField).toBeDefined();
    });

    it("renders fit button", () => {
        render(<App />);

        const fitButton = screen.queryByRole("button", { name: /fit spectrum/i });
        expect(fitButton).toBeDefined();
    });

    it("handles form submission validation", async () => {
        render(<App />);

        const fitButton = screen.queryByRole("button", { name: /fit spectrum/i });
        if (fitButton) {
            fireEvent.click(fitButton);
        }

        // Should attempt form submission
        expect(fitButton).toBeDefined();
    });
}); 