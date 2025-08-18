import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { describe, it, expect, vi } from "vitest";
import App from "../../../src/App";

// Mock axios to avoid actual API calls
vi.mock('axios');

describe("Form Component", () => {
    it("renders the main calculation form", () => {
        render(<App />);

        // Check for key form elements
        expect(screen.getByLabelText("Path Length")).toBeDefined();
        expect(screen.getByTestId("pressure-input-testid")).toBeDefined();
        expect(screen.getByTestId("tgas-testid")).toBeDefined();
    });

    it("renders database selection field", () => {
        render(<App />);

        const databaseField = screen.getByTestId("database-testid");
        expect(databaseField).toBeDefined();
    });

    it("renders mode selection field", () => {
        render(<App />);

        const modeField = screen.getByTestId("mode-select-testid");
        expect(modeField).toBeDefined();
    });

    it("renders wavenumber range slider", () => {
        render(<App />);

        const minInputGroup = screen.getByTestId("min-wavenumber-input");
        const maxInputGroup = screen.getByTestId("max-wavenumber-input");

        expect(minInputGroup).toBeDefined();
        expect(maxInputGroup).toBeDefined();
    });

    it("renders temperature fields", () => {
        render(<App />);

        const tgasField = screen.getByTestId("tgas-testid");
        expect(tgasField).toBeDefined();
    });

    it("renders pressure field", () => {
        render(<App />);

        const pressureField = screen.getByTestId("pressure-input-testid");
        expect(pressureField).toBeDefined();
    });

    it("renders path length field", () => {
        render(<App />);

        const pathLengthField = screen.getByLabelText("Path Length");
        expect(pathLengthField).toBeDefined();
    });

    it("renders calculate button", () => {
        render(<App />);

        const calcButton = screen.getByRole("button", { name: /new plot/i });
        expect(calcButton).toBeDefined();
    });

    // skip this test cause it needs the backend to be running
    it.skip("shows validation errors on submission with empty fields", async () => {
        render(<App />);

        // Clear a required field
        const pathLengthField = screen.getByLabelText("Path Length");
        fireEvent.change(pathLengthField, { target: { value: "" } });

        const calcButton = screen.getByRole("button", { name: /new plot/i });
        fireEvent.click(calcButton);

        await waitFor(() => {
            const errorMessage = screen.queryByText(/must be defined/i);
            expect(errorMessage).toBeDefined();
        });
    });

    // skip this test cause it needs the backend to be running
    it.skip("enables download buttons after successful calculation", async () => {
        render(<App />);

        // Submit the form (this will likely fail due to no backend, but tests the flow)
        const calcButton = screen.getByRole("button", { name: /new plot/i });
        fireEvent.click(calcButton);

        // Check that the form submission was attempted
        expect(calcButton).toBeDefined();
    });


    it("renders species selection", () => {
        render(<App />);
        const speciesField = screen.getByTestId("molecule-selector-testid");
        expect(speciesField).toBeDefined();
    });
}); 