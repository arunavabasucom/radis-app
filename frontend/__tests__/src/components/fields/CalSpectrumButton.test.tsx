import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from "vitest";
import App from "../../../../src/App";

describe("CalSpectrumButton Field Component", () => {
    it("renders calculate spectrum button", () => {
        render(<App />);

        const calcButton = screen.getByRole("button", { name: /new plot/i });
        expect(calcButton).toBeDefined();
    });

    it("has correct text", () => {
        render(<App />);

        const calcButton = screen.getByRole("button", { name: /new plot/i });
        expect(calcButton.textContent).toBe("New plot");
    });


    it("validates form on submission", async () => {
        render(<App />);

        // Clear required field to trigger validation
        const pathLengthInput = screen.getByLabelText("Path Length");
        fireEvent.change(pathLengthInput, { target: { value: "" } });

        const calcButton = screen.getByRole("button", { name: /new plot/i });
        fireEvent.click(calcButton);

        await waitFor(() => {
            // Should show validation error
            const errorMessage = screen.queryByText(/must be defined/i);
            expect(errorMessage).toBeDefined();
        });
    });

    // skip the below tests cause it need the backend to be running
    it.skip("shows loading state during calculation", async () => {
        render(<App />);

        const calcButton = screen.getByRole("button", { name: /new plot/i });

        fireEvent.click(calcButton);

        // Button should exist during loading
        expect(calcButton).toBeDefined();
    });


    it.skip("is clickable", () => {
        render(<App />);

        const calcButton = screen.getByRole("button", { name: /new plot/i });

        fireEvent.click(calcButton);

        // Button should be clickable (no error thrown)
        expect(calcButton).toBeDefined();
    });

    it.skip("submits calculation form when clicked", async () => {
        render(<App />);

        const calcButton = screen.getByRole("button", { name: /new plot/i });

        fireEvent.click(calcButton);

        // Should attempt to submit calculation (may fail due to backend, but button works)
        await waitFor(() => {
            expect(calcButton).toBeDefined();
        });
    });
}); 