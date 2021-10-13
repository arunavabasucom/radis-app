import React from "react";
import Plot from "react-plotly.js";
import { CalcSpectrumResponseData, palette, Species } from "../constants";
import { addSubscriptsToMolecule } from "../utils";

interface CalcSpectrumPlotProps {
  data: CalcSpectrumResponseData;
  species: Species[];
  minWavenumberRange: number;
  maxWavenumberRange: number;
  mode: string;
}

export const CalcSpectrumPlot: React.FC<CalcSpectrumPlotProps> = ({
  data,
  species,
  minWavenumberRange,
  maxWavenumberRange,
  mode,
}) => {
  let modeLabel;
  if (mode === "absorbance") {
    modeLabel = "Absorbance";
    data.units = "-ln(I/I0)";
  } else if (mode === "transmittance_noslit") {
    modeLabel = "Transmittance";
  } else if (mode === "radiance_noslit") {
    modeLabel = "Radiance";
  } else {
    throw new Error("Invalid mode");
  }
  return (
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
          title: {
            text: `${modeLabel}${
              data.units.length ? " (" + data.units + ")" : ""
            }`,
          },
          type: "linear",
          fixedrange: false,
        },
      }}
    />
  );
};
