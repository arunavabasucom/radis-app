import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import user from "@testing-library/user-event";
import React from "react";
import { describe, it, expect } from "vitest";
import App from "../../../../src/App";

describe("Normalize Field Component", () => {
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

    it("renders normalize checkbox field", async () => {
        await navigateToFitSpectrum();

        const normalizeField = screen.getByTestId("normalize-testid");
        expect(normalizeField).toBeInTheDocument();
        expect(normalizeField).toBeVisible();
    });

    it("has unchecked state as default", () => {
        render(<App />);

        const normalizeField = within(screen.getByTestId('normalize-testid')).getByRole('checkbox')
        expect(normalizeField).toHaveProperty('checked', false)
    });

    it("can be checked", async () => {
        render(<App />);

        const normalizeField = within(screen.getByTestId('normalize-testid')).getByRole('checkbox')

        fireEvent.click(normalizeField);

        await waitFor(() => {
            expect(normalizeField).toHaveProperty('checked', true)
        });
    });

    it("can be unchecked after being checked", async () => {
        render(<App />);

        const normalizeField = within(screen.getByTestId('normalize-testid')).getByRole('checkbox')

        // Check it first
        fireEvent.click(normalizeField);
        await waitFor(() => {
            expect(normalizeField).toHaveProperty('checked', true)
        });

        // Then uncheck it
        fireEvent.click(normalizeField);
        await waitFor(() => {
            expect(normalizeField).toHaveProperty('checked', false)
        });
    });

    it("shows correct label", () => {
        render(<App />);

        expect(screen.getByText("Normalize")).toBeInTheDocument();
    });
}); 