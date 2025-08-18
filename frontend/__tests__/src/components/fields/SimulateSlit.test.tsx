import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import user from "@testing-library/user-event";
import React from "react";
import App from "../../../../src/App";
import useFromStore from "../../../../src/store/form";

beforeEach(() => {
    const { setUseSlit } = useFromStore.getState();
    setUseSlit(false);
});

describe("testing slit switch and slit size field", () => {
    test("testing slit switch field render with defaultValue and perfectly visible", async () => {
        render(<App />);
        // change mode to make the slit switch visible
        const select = screen.getByTestId("mode-select-testid");
        await user.click(select);

        // pick an option
        const option = await screen.findByText("Radiance");
        await user.click(option);


        // click the slit switch to make it visible
        const slitSwitch = screen.getByTestId("slit-switch-testid");
        const inputElement = slitSwitch.querySelector("input");
        if (inputElement) {
            fireEvent.click(inputElement);
        }
        expect(slitSwitch).toBeVisible();
        expect(slitSwitch).toBeInTheDocument();

        // check the slit size input is visible and in the document
        const slitSizeInput = screen.getByLabelText("Slit Size");
        expect(slitSizeInput).toBeVisible();
        expect(slitSizeInput).toBeInTheDocument();
        expect(slitSizeInput).toHaveValue(5);
        fireEvent.input(slitSizeInput, {
            target: { value: 100 },
        });
        expect(slitSizeInput).toHaveValue(100);
    });
    test("testing slit size field validation for undefined and negative values", async () => {
        render(<App />);
        // change mode to make the slit switch visible
        const select = screen.getByTestId("mode-select-testid");
        await user.click(select);

        // pick an option
        const option = await screen.findByText("Radiance");
        await user.click(option);


        // click the slit switch to make it visible
        const slitSwitch = screen.getByTestId("slit-switch-testid");
        const inputElement = slitSwitch.querySelector("input");
        if (inputElement) {
            fireEvent.click(inputElement);
        }
        expect(slitSwitch).toBeVisible();
        expect(slitSwitch).toBeInTheDocument();

        // check the slit size input is visible and in the document
        const slitSizeInput = screen.getByLabelText("Slit Size");
        expect(slitSizeInput).toBeVisible();
        expect(slitSizeInput).toBeInTheDocument();
        expect(slitSizeInput).toHaveValue(5);
        fireEvent.input(slitSizeInput, {
            target: { value: ' ' },
        });
        const button = screen.getByRole("button", {
            name: /new plot/i,
        });
        user.click(button);
        // Verify must be defined message is present
        await waitFor(async () => {
            expect(
                screen.getByText("Simulate slit must be defined")
            ).toBeInTheDocument();
        });

        // Verify must be positive message is present
        fireEvent.input(slitSizeInput, {
            target: { value: -1 },
        });
        expect(slitSizeInput).toHaveValue(-1);
        user.click(button);
        await waitFor(async () => {
            expect(
                screen.getByText("Simulate slit must be positive")
            ).toBeInTheDocument();
        });

    });

});