import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from "vitest";
import { InfoPopover } from "../../../src/components/InfoPopover";
import { CssVarsProvider, extendTheme } from "@mui/joy/styles";
import { JoyColorSchemes } from "../../../src/constants";

const theme = extendTheme({
    colorSchemes: JoyColorSchemes,
});

describe("InfoPopover Component", () => {
    it("renders info popover component", () => {
        render(
            <CssVarsProvider theme={theme}>
                <InfoPopover />
            </CssVarsProvider>
        );

        // Should render without throwing error
        expect(document.body).toBeDefined();
    });
    it("displays popover content", () => {
        render(
            <CssVarsProvider theme={theme}>
                <InfoPopover />
            </CssVarsProvider>
        );

        // Click the info button
        const buttons = screen.getAllByRole("button");
        fireEvent.click(buttons[0]);

        // Look for the text content in the popover
        expect(screen.getByText("RADIS")).toBeTruthy();
    });

}); 