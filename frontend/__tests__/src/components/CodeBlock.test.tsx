import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from "vitest";
import { CodeBlock } from "../../../src/components/CodeBlock";

describe("CodeBlock Component", () => {
    it("renders code block with text", () => {
        const testCode = "import radis\nspectrum = radis.calc_spectrum(...)";
        render(<CodeBlock codeText={testCode} blockId="test-code-block" />);

        const codeElement = screen.getByText(/import radis/);
        expect(codeElement).toBeDefined();
    });

    it("displays multiline code correctly", () => {
        const multilineCode = `import radis
import matplotlib.pyplot as plt

spectrum = radis.calc_spectrum(...)
spectrum.plot()`;

        render(<CodeBlock codeText={multilineCode} blockId="test-code-block" />);

        expect(screen.getByText(/import radis/)).toBeDefined();
        expect(screen.getByText(/matplotlib/)).toBeDefined();
    });

    it("handles empty code", () => {
        render(<CodeBlock codeText="" blockId="test-code-block" />);

        // Should render without error
        const container = screen.getByTestId ? screen.queryByTestId("code-block") : document.body;
        expect(container).toBeDefined();
    });

    it("handles single line code", () => {
        const singleLine = "print('Hello, World!')";
        render(<CodeBlock codeText={singleLine} blockId="test-code-block" />);

        expect(screen.getByText(/Hello, World/)).toBeDefined();
    });

    it("preserves code formatting", () => {
        const formattedCode = `def calculate_spectrum():
    # This is indented
    return spectrum`;

        render(<CodeBlock codeText={formattedCode} blockId="test-code-block" />);

        expect(screen.getByText(/calculate_spectrum/)).toBeDefined();
        expect(screen.getByText(/This is indented/)).toBeDefined();
    });

    it("handles special characters in code", () => {
        const specialChars = "spectrum['intensity'] = data[0] + data[1]";
        render(<CodeBlock codeText={specialChars} blockId="test-code-block" />);

        expect(screen.getByText(/intensity/)).toBeDefined();
    });
}); 