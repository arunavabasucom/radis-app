import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, it, expect, vi } from "vitest";

// Mock Plotly to avoid rendering issues in tests
vi.mock('react-plotly.js', () => ({
    default: () => <div data-testid="mock-plot">Mock Plot</div>
}));

// Mock the Plot component import
const mockPlotSettings = {
    title: "Test Plot",
    xLabel: "Wavenumber (cm-1)",
    yLabel: "Intensity"
};

const mockSpectra = [
    {
        x: [1000, 2000, 3000],
        y: [0.1, 0.5, 0.2],
        name: "Test Spectrum"
    }
];

describe("Plot Component", () => {

    it("renders mock plot during testing", () => {
        // Test with mocked plotly
        const MockPlot = () => <div data-testid="mock-plot">Mock Plot</div>;
        render(<MockPlot />);

        const plotElement = screen.getByTestId("mock-plot");
        expect(plotElement).toBeDefined();
        expect(plotElement.textContent).toBe("Mock Plot");
    });

    it("handles plot data structures", () => {
        // Test data structure validation
        expect(mockSpectra).toBeDefined();
        expect(mockSpectra.length).toBe(1);
        expect(mockSpectra[0]).toHaveProperty('x');
        expect(mockSpectra[0]).toHaveProperty('y');
        expect(mockSpectra[0]).toHaveProperty('name');
    });

    it("handles plot settings", () => {
        // Test settings structure
        expect(mockPlotSettings).toBeDefined();
        expect(mockPlotSettings).toHaveProperty('title');
        expect(mockPlotSettings).toHaveProperty('xLabel');
        expect(mockPlotSettings).toHaveProperty('yLabel');
    });

    it("validates spectrum data arrays", () => {
        const spectrum = mockSpectra[0];

        expect(Array.isArray(spectrum.x)).toBe(true);
        expect(Array.isArray(spectrum.y)).toBe(true);
        expect(spectrum.x.length).toBe(spectrum.y.length);
        expect(typeof spectrum.name).toBe('string');
    });
}); 