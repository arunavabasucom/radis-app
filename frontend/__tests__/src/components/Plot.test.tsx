import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, it, expect, vi } from "vitest";
import { Plot } from "../../../src/components/Plot";
import { PlotSettings, Spectrum } from "../../../src/constants";
import { Species } from "../../../src/components/types";

// Mock Plotly to avoid rendering issues in tests
vi.mock('react-plotly.js', () => ({
    default: ({ data, layout, config }: any) => (
        <div data-testid="mock-plot" data-layout={JSON.stringify(layout)} data-config={JSON.stringify(config)}>
            {data?.map((trace: any, index: number) => (
                <div key={index} data-testid={`plot-trace-${index}`} data-trace={JSON.stringify(trace)}>
                    {trace.name}
                </div>
            ))}
        </div>
    )
}));

// Mock the color scheme hook
vi.mock('@mui/joy/styles', () => ({
    useColorScheme: () => ({
        mode: 'light'
    })
}));

// Mock the molecule subscripts module
vi.mock('../../../src/modules/molecule-subscripts', () => ({
    addSubscriptsToMolecule: (molecule: string) => molecule
}));

describe("Plot Component", () => {
    const mockSpecies: Species[] = [
        {
            molecule: "CO2",
            mole_fraction: 0.1,
            is_all_isotopes: true
        }
    ];

    const mockSpectrum: Spectrum = {
        database: "hitran",
        tgas: 300,
        pressure: 1.0,
        pressure_units: "cds.atm",
        wavelength_units: "u.nm",
        species: mockSpecies,
        x: [1000, 2000, 3000],
        y: [0.1, 0.5, 0.2],
        label: "Test Spectrum"
    };

    const mockPlotSettings: PlotSettings = {
        mode: "absorbance",
        units: "cm-1"
    };

    it("renders the plot component with single spectrum", () => {
        render(<Plot spectra={[mockSpectrum]} plotSettings={mockPlotSettings} />);

        const plotElement = screen.getByTestId("mock-plot");
        expect(plotElement).toBeInTheDocument();
    });

    it("renders multiple spectra", () => {
        const secondSpectrum: Spectrum = {
            ...mockSpectrum,
            database: "geisa",
            label: "Second Spectrum"
        };

        render(<Plot spectra={[mockSpectrum, secondSpectrum]} plotSettings={mockPlotSettings} />);

        const plotElement = screen.getByTestId("mock-plot");
        expect(plotElement).toBeInTheDocument();

        // Check that both traces are rendered
        expect(screen.getByTestId("plot-trace-0")).toBeInTheDocument();
        expect(screen.getByTestId("plot-trace-1")).toBeInTheDocument();
    });

    it("formats spectrum names correctly", () => {
        render(<Plot spectra={[mockSpectrum]} plotSettings={mockPlotSettings} />);

        const traceElement = screen.getByTestId("plot-trace-0");
        expect(traceElement).toBeInTheDocument();

        // Check that the formatted name contains expected parts
        const traceData = JSON.parse(traceElement.getAttribute("data-trace") || "{}");
        expect(traceData.name).toContain("CO2");
        expect(traceData.name).toContain("X=0.1");
        expect(traceData.name).toContain("HITRAN");
        expect(traceData.name).toContain("Pressure=1 atm");
        expect(traceData.name).toContain("Tgas=300 K");
    });

    it("handles different plot modes", () => {
        const absorbanceSettings: PlotSettings = { mode: "absorbance", units: "" };
        const transmittanceSettings: PlotSettings = { mode: "transmittance_noslit", units: "" };
        const radianceSettings: PlotSettings = { mode: "radiance_noslit", units: "" };

        const { rerender } = render(<Plot spectra={[mockSpectrum]} plotSettings={absorbanceSettings} />);
        let plotElement = screen.getByTestId("mock-plot");
        let layout = JSON.parse(plotElement.getAttribute("data-layout") || "{}");
        expect(layout.yaxis.title.text).toBe("Absorbance");

        rerender(<Plot spectra={[mockSpectrum]} plotSettings={transmittanceSettings} />);
        plotElement = screen.getByTestId("mock-plot");
        layout = JSON.parse(plotElement.getAttribute("data-layout") || "{}");
        expect(layout.yaxis.title.text).toBe("Transmittance");

        rerender(<Plot spectra={[mockSpectrum]} plotSettings={radianceSettings} />);
        plotElement = screen.getByTestId("mock-plot");
        layout = JSON.parse(plotElement.getAttribute("data-layout") || "{}");
        expect(layout.yaxis.title.text).toBe("Radiance");
    });

    it("handles units in y-axis title", () => {
        const settingsWithUnits: PlotSettings = { mode: "absorbance", units: "cm-1" };
        render(<Plot spectra={[mockSpectrum]} plotSettings={settingsWithUnits} />);

        const plotElement = screen.getByTestId("mock-plot");
        const layout = JSON.parse(plotElement.getAttribute("data-layout") || "{}");
        expect(layout.yaxis.title.text).toBe("Absorbance (cm-1)");
    });

    it("handles wavelength units correctly", () => {
        const spectrumWithNm: Spectrum = {
            ...mockSpectrum,
            wavelength_units: "u.nm"
        };

        const spectrumWithCm: Spectrum = {
            ...mockSpectrum,
            wavelength_units: "u.cm-1"
        };

        const { rerender } = render(<Plot spectra={[spectrumWithNm]} plotSettings={mockPlotSettings} />);
        let plotElement = screen.getByTestId("mock-plot");
        let layout = JSON.parse(plotElement.getAttribute("data-layout") || "{}");
        expect(layout.xaxis.title.text).toBe("Wavelength (nm)");

        rerender(<Plot spectra={[spectrumWithCm]} plotSettings={mockPlotSettings} />);
        plotElement = screen.getByTestId("mock-plot");
        layout = JSON.parse(plotElement.getAttribute("data-layout") || "{}");
        expect(layout.xaxis.title.text).toBe("Wavelength (cm⁻¹)");
    });

    it("handles pressure units conversion", () => {
        const spectrumWithAtm: Spectrum = {
            ...mockSpectrum,
            pressure_units: "cds.atm"
        };

        const spectrumWithBar: Spectrum = {
            ...mockSpectrum,
            pressure_units: "cds.bar"
        };

        const { rerender } = render(<Plot spectra={[spectrumWithAtm]} plotSettings={mockPlotSettings} />);
        let traceElement = screen.getByTestId("plot-trace-0");
        let traceData = JSON.parse(traceElement.getAttribute("data-trace") || "{}");
        expect(traceData.name).toContain("atm");

        rerender(<Plot spectra={[spectrumWithBar]} plotSettings={mockPlotSettings} />);
        traceElement = screen.getByTestId("plot-trace-0");
        traceData = JSON.parse(traceElement.getAttribute("data-trace") || "{}");
        expect(traceData.name).toContain("bar");
    });

    it("handles spectra with rotational and vibrational temperatures", () => {
        const spectrumWithTemps: Spectrum = {
            ...mockSpectrum,
            trot: 350,
            tvib: 400
        };

        render(<Plot spectra={[spectrumWithTemps]} plotSettings={mockPlotSettings} />);

        const traceElement = screen.getByTestId("plot-trace-0");
        const traceData = JSON.parse(traceElement.getAttribute("data-trace") || "{}");
        expect(traceData.name).toContain("Trot=350 K");
        expect(traceData.name).toContain("Tvib=400 K");
    });

    it("handles multiple species in spectrum", () => {
        const spectrumWithMultipleSpecies: Spectrum = {
            ...mockSpectrum,
            species: [
                { molecule: "CO2", mole_fraction: 0.1, is_all_isotopes: true },
                { molecule: "H2O", mole_fraction: 0.05, is_all_isotopes: false }
            ]
        };

        render(<Plot spectra={[spectrumWithMultipleSpecies]} plotSettings={mockPlotSettings} />);

        const traceElement = screen.getByTestId("plot-trace-0");
        const traceData = JSON.parse(traceElement.getAttribute("data-trace") || "{}");
        expect(traceData.name).toContain("CO2");
        expect(traceData.name).toContain("H2O");
        expect(traceData.name).toContain("X=0.1");
        expect(traceData.name).toContain("X=0.05");
    });

    it("generates correct plot title for single spectrum", () => {
        render(<Plot spectra={[mockSpectrum]} plotSettings={mockPlotSettings} />);

        const plotElement = screen.getByTestId("mock-plot");
        const layout = JSON.parse(plotElement.getAttribute("data-layout") || "{}");
        expect(layout.title).toBe("Spectrum");
    });

    it("generates correct plot title for multiple spectra", () => {
        const secondSpectrum: Spectrum = {
            ...mockSpectrum,
            database: "geisa"
        };

        render(<Plot spectra={[mockSpectrum, secondSpectrum]} plotSettings={mockPlotSettings} />);

        const plotElement = screen.getByTestId("mock-plot");
        const layout = JSON.parse(plotElement.getAttribute("data-layout") || "{}");
        expect(layout.title).toBe("Spectra");
    });

    it("assigns different colors to different spectra", () => {
        const secondSpectrum: Spectrum = {
            ...mockSpectrum,
            database: "geisa"
        };

        render(<Plot spectra={[mockSpectrum, secondSpectrum]} plotSettings={mockPlotSettings} />);

        const trace1 = screen.getByTestId("plot-trace-0");
        const trace2 = screen.getByTestId("plot-trace-1");

        const trace1Data = JSON.parse(trace1.getAttribute("data-trace") || "{}");
        const trace2Data = JSON.parse(trace2.getAttribute("data-trace") || "{}");

        expect(trace1Data.marker.color).toBeDefined();
        expect(trace2Data.marker.color).toBeDefined();
        expect(trace1Data.marker.color).not.toBe(trace2Data.marker.color);
    });

    it("handles empty spectra array", () => {
        render(<Plot spectra={[]} plotSettings={mockPlotSettings} />);

        const plotElement = screen.getByTestId("mock-plot");
        expect(plotElement).toBeInTheDocument();

        const layout = JSON.parse(plotElement.getAttribute("data-layout") || "{}");
        expect(layout.title).toBe("Spectra");
    });

    it("includes plot configuration for image export", () => {
        render(<Plot spectra={[mockSpectrum]} plotSettings={mockPlotSettings} />);

        const plotElement = screen.getByTestId("mock-plot");
        const config = JSON.parse(plotElement.getAttribute("data-config") || "{}");
        expect(config.toImageButtonOptions).toBeDefined();
        expect(config.toImageButtonOptions.filename).toBeDefined();
    });

    it("generates filename based on spectra", () => {
        const spectrum1: Spectrum = {
            ...mockSpectrum,
            species: [{ molecule: "CO2", mole_fraction: 0.1, is_all_isotopes: true }]
        };

        const spectrum2: Spectrum = {
            ...mockSpectrum,
            database: "geisa",
            species: [{ molecule: "H2O", mole_fraction: 0.05, is_all_isotopes: false }]
        };

        render(<Plot spectra={[spectrum1, spectrum2]} plotSettings={mockPlotSettings} />);

        const plotElement = screen.getByTestId("mock-plot");
        const config = JSON.parse(plotElement.getAttribute("data-config") || "{}");
        expect(config.toImageButtonOptions.filename).toContain("CO2_hitran");
        expect(config.toImageButtonOptions.filename).toContain("H2O_geisa");
    });

    it("handles spectrum without label", () => {
        const spectrumWithoutLabel: Spectrum = {
            ...mockSpectrum,
            label: undefined
        };

        render(<Plot spectra={[spectrumWithoutLabel]} plotSettings={mockPlotSettings} />);

        const traceElement = screen.getByTestId("plot-trace-0");
        const traceData = JSON.parse(traceElement.getAttribute("data-trace") || "{}");
        expect(traceData.name).not.toContain("undefined");
        expect(traceData.name).toContain("CO2");
    });

    it("includes plot layout configuration", () => {
        render(<Plot spectra={[mockSpectrum]} plotSettings={mockPlotSettings} />);

        const plotElement = screen.getByTestId("mock-plot");
        const layout = JSON.parse(plotElement.getAttribute("data-layout") || "{}");

        expect(layout.width).toBe(1050);
        expect(layout.height).toBe(650);
        expect(layout.showlegend).toBe(true);
        expect(layout.legend.orientation).toBe("h");
        expect(layout.margin.l).toBe(90);
        expect(layout.margin.r).toBe(10);
    });

    it("includes update menus for scale switching", () => {
        render(<Plot spectra={[mockSpectrum]} plotSettings={mockPlotSettings} />);

        const plotElement = screen.getByTestId("mock-plot");
        const layout = JSON.parse(plotElement.getAttribute("data-layout") || "{}");

        expect(layout.updatemenus).toBeDefined();
        expect(layout.updatemenus.length).toBe(1);
        expect(layout.updatemenus[0].buttons.length).toBe(2);
        expect(layout.updatemenus[0].buttons[0].label).toBe("Linear Scale");
        expect(layout.updatemenus[0].buttons[1].label).toBe("Log Scale");
    });
}); 