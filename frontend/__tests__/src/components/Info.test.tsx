import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from "vitest";
import { Info } from "../../../src/components/Info";
import { CssVarsProvider, extendTheme } from "@mui/joy/styles";
import { JoyColorSchemes } from "../../../src/constants";

const theme = extendTheme({
    colorSchemes: JoyColorSchemes,
});

describe("Info Component", () => {
    it("renders info component", () => {
        render(
            <CssVarsProvider theme={theme}>
                <Info helpText="test" />
            </CssVarsProvider>
        );

        // Should render without throwing error
        expect(document.body).toBeDefined();
    });

    it("displays information content", () => {
        render(
            <CssVarsProvider theme={theme}>
                <Info helpText="test" />
            </CssVarsProvider>
        );

        // Click the info button
        const buttons = screen.getAllByRole("button");
        fireEvent.click(buttons[0]);

        // Look for the text content
        expect(screen.getByText("test")).toBeTruthy();
    });

}); 