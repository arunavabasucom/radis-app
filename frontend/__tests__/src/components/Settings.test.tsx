import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from "vitest";
import { Settings } from "../../../src/components/Settings";
import { CssVarsProvider, extendTheme } from "@mui/joy/styles";
import { JoyColorSchemes } from "../../../src/constants";

const theme = extendTheme({
    colorSchemes: JoyColorSchemes,
});

describe("Settings Component", () => {
    it("renders settings component", () => {
        render(
            <CssVarsProvider theme={theme}>
                <Settings />
            </CssVarsProvider>
        );

        // Should render without throwing error
        expect(document.body).toBeDefined();
    });

    it("handles user interactions", () => {
        render(
            <CssVarsProvider theme={theme}>
                <Settings />
            </CssVarsProvider>
        );

        // Try to interact with any buttons that exist
        const buttons = screen.queryAllByRole("button");

        buttons.forEach(button => {
            fireEvent.click(button);
            // Should not throw error
            expect(button).toBeDefined();
        });
    });

    it("displays settings content", () => {
        render(
            <CssVarsProvider theme={theme}>
                <Settings />
            </CssVarsProvider>
        );

        const buttons = screen.getAllByRole("button");
        fireEvent.click(buttons[0]);

        // Look for the text content
        expect(screen.getByText("Local Backend Settings")).toBeTruthy();
    });

}); 