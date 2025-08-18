import { fireEvent, render, screen, within } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from "vitest";
import App from "../../../../src/App";

describe("WavenumberRangeSlider Field Component", () => {

    it("allows entering min and max values", async () => {
        render(<App />);

        const minInputGroup = screen.getByTestId("min-wavenumber-input");
        const maxInputGroup = screen.getByTestId("max-wavenumber-input");

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