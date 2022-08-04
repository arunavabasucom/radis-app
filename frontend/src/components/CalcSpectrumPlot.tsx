import React from "react";
import Plot from "react-plotly.js";
import { addSubscriptsToMolecule } from "../utils";
import { CalcSpectrumResponseData, palette } from "../constants";
import { Species } from "./types";

export interface CalcSpectrumPlotdata {
  data: CalcSpectrumResponseData;
  species: Species[];
  min_wavenumber_range: number;
  max_wavenumber_range: number;
  mode: string;
}

const CalcSpectrumPlot_ = ({
  data,
  species,
  min_wavenumber_range,
  max_wavenumber_range,

  mode,
}: CalcSpectrumPlotdata): JSX.Element => {
  let modeLabel;
  if (mode === "absorbance") {
    modeLabel = "Absorbance";
    data.units = "-ln(I/I0)";
  } else if (mode.startsWith("transmittance")) {
    modeLabel = "Transmittance";
  } else if (mode.startsWith("radiance")) {
    modeLabel = "Radiance";
  } else {
    throw new Error("Invalid mode");
  }

  return (
    <>
      {
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
              range: [min_wavenumber_range, max_wavenumber_range],
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
      }
    </>
  );
};

export const CalcSpectrumPlot = React.memo(CalcSpectrumPlot_);
