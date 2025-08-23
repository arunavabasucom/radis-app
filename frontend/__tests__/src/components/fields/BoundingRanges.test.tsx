import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import user from "@testing-library/user-event";
import React from "react";
import { describe, it, expect } from "vitest";
import App from "../../../../src/App";

describe("BoundingRanges Field Component", () => {

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

    it("allows entering min and max values", async () => {

        await navigateToFitSpectrum();

        // Check the tgas checkbox to show the bounding range inputs
        const checkbox = within(screen.getByTestId('tgas_checkbox_testid')).getByRole('checkbox')
        expect(checkbox).toHaveProperty('checked', false)
        await user.click(checkbox);
        expect(checkbox).toHaveProperty('checked', true)

        const minInputGroup = screen.getByTestId("min-tgasBounding-input");
        const maxInputGroup = screen.getByTestId("max-tgasBounding-input");

        expect(minInputGroup).toBeInTheDocument();
        expect(maxInputGroup).toBeInTheDocument();

        const maxInput = within(maxInputGroup).getByRole("textbox");
        const minInput = within(minInputGroup).getByRole("textbox");

        // enter values
        fireEvent.change(minInput, { target: { value: "1000" } });
        fireEvent.change(maxInput, { target: { value: "2000" } });

        // check values
        expect(minInput.value).toBe("1000");
        expect(maxInput.value).toBe("2000");
    });

}); 