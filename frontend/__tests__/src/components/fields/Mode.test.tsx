import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from "vitest";
import App from "../../../../src/App";

describe("Mode Field Component", () => {
    it("renders mode field with default value", () => {
        render(<App />);

        const modeField = screen.getByTestId("mode-select-testid");
        expect(modeField).toBeInTheDocument();
        expect(modeField).toBeVisible();
    });

    it("has absorbance as default selection", () => {
        render(<App />);

        const modeField = screen.getByTestId("mode-select-testid");
        expect(modeField).toHaveTextContent("Absorbance");
    });

    it("can select different mode options", async () => {
        render(<App />);

        const modeField = screen.getByTestId("mode-select-testid");

        // Click to open dropdown
        fireEvent.mouseDown(modeField);

        await waitFor(() => {
            // Should show mode options
            expect(screen.getByText("Radiance")).toBeInTheDocument();
            expect(screen.getByText("Transmittance")).toBeInTheDocument();
        });
    });

    it("can switch to radiance mode", async () => {
        render(<App />);

        const modeField = screen.getByTestId("mode-select-testid");

        // Click to open dropdown
        fireEvent.mouseDown(modeField);

        await waitFor(() => {
            const radianceOption = screen.getByText("Radiance");
            fireEvent.click(radianceOption);
        });

        await waitFor(() => {
            expect(modeField).toHaveTextContent("Radiance");
        });
    });

    it("can switch to transmittance mode", async () => {
        render(<App />);

        const modeField = screen.getByTestId("mode-select-testid");

        // Click to open dropdown
        fireEvent.mouseDown(modeField);

        await waitFor(() => {
            const transmittanceOption = screen.getByText("Transmittance");
            fireEvent.click(transmittanceOption);
        });

        await waitFor(() => {
            expect(modeField).toHaveTextContent("Transmittance");
        });
    });

    it("shows all mode options when opened", async () => {
        render(<App />);

        const modeField = screen.getByTestId("mode-select-testid");

        // Click to open dropdown
        fireEvent.mouseDown(modeField);

        await waitFor(() => {
            expect(screen.getByText("Radiance")).toBeInTheDocument();
            expect(screen.getByText("Transmittance")).toBeInTheDocument();
        });
    });
}); 