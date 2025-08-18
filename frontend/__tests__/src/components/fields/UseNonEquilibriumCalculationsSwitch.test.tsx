import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from "vitest";
import App from "../../../../src/App";

describe("UseNonEquilibriumCalculationsSwitch Component", () => {
    it("renders non-equilibrium switch", () => {
        render(<App />);
        const switchElement = within(screen.getByTestId('non-equilibrium-switch-testid')).getByRole('checkbox')
        expect(switchElement).toBeDefined();
    });

    it("is unchecked by default", () => {
        render(<App />);

        const switchElement = within(screen.getByTestId('non-equilibrium-switch-testid')).getByRole('checkbox')
        expect(switchElement).toHaveProperty('checked', false)
    });

    it("can be toggled on", () => {
        render(<App />);

        const switchElement = within(screen.getByTestId('non-equilibrium-switch-testid')).getByRole('checkbox')
        fireEvent.click(switchElement);

        expect(switchElement).toHaveProperty('checked', true)
    });

    it("can be toggled off after being on", () => {
        render(<App />);

        const switchElement = within(screen.getByTestId('non-equilibrium-switch-testid')).getByRole('checkbox')

        // Turn on
        fireEvent.click(switchElement)
        expect(switchElement).toHaveProperty('checked', true)

        // Turn off
        fireEvent.click(switchElement);
        expect(switchElement).toHaveProperty('checked', false)
    });

    it("shows additional temperature fields when enabled", async () => {
        render(<App />);

        const switchElement = within(screen.getByTestId('non-equilibrium-switch-testid')).getByRole('checkbox')

        fireEvent.click(switchElement);

        await waitFor(() => {
            // Should show TVib and TRot fields
            const tvibField = screen.queryByTestId("tvib-testid");
            const trotField = screen.queryByTestId("trot-testid");

            expect(tvibField).toBeDefined();
            expect(trotField).toBeDefined();
        });
    });

    it("hides additional temperature fields when disabled", async () => {
        render(<App />);

        const switchElement = within(screen.getByTestId('non-equilibrium-switch-testid')).getByRole('checkbox')

        // Enable first
        fireEvent.click(switchElement);

        await waitFor(() => {
            expect(screen.queryByTestId("tvib-testid")).toBeDefined();
        });

        // Then disable
        fireEvent.click(switchElement);

        await waitFor(() => {
            const tvibField = screen.queryByTestId("tvib-testid");
            const trotField = screen.queryByTestId("trot-testid");

            // These fields should be hidden or not rendered
            expect(tvibField).toBeNull();
            expect(trotField).toBeNull();
        });
    });
}); 