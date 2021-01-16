import React from "react";
import Plot from "react-plotly.js";
import { CalcSpectrumResponseData, palette, Species } from "../constants";
import { addSubscriptsToMolecule } from "../utils";

interface CalcSpectrumPlotProps {
  data: CalcSpectrumResponseData;
  species: Species[];
  minWavenumberRange: number;
  maxWavenumberRange: number;
}

export const CalcSpectrumPlot: React.FC<CalcSpectrumPlotProps> = ({
  data,
  species,
  minWavenumberRange,
  maxWavenumberRange,
}) => (
  <Plot
    className="Plot"
    data={[
      {
        x: data.x,
        y: data.y,
        type: "scatter",
        marker: { color: palette.secondary.main },
      },
    ]}
    layout={{
      width: 800,
      height: 600,
      title: `Spectrum for ${species
        .map(({ molecule, mole_fraction }) => {
          const moleculeWithSubscripts = addSubscriptsToMolecule(
            molecule || ""
          );
          return `${moleculeWithSubscripts} (χ${moleculeWithSubscripts.sub()} = ${
            mole_fraction as number
          })`;
        })
        .join(", ")}`,
      font: { family: "Roboto", color: "#000" },
      xaxis: {
        range: [minWavenumberRange, maxWavenumberRange],
        title: { text: "Wavenumber (cm⁻¹)" },
        rangeslider: {
          // TODO: Update typing in DefinitelyTyped
          // @ts-ignore
          autorange: true,
          // @ts-ignore
          yaxis: { rangemode: "auto" },
        },
        type: "linear",
      },
      yaxis: {
        autorange: true,
        title: { text: "Radiance (mW/cm²/sr/nm)" },
        type: "linear",
        fixedrange: false,
      },
    }}
  />
);
