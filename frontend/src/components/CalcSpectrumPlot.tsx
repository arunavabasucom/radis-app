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
  //buttons to switch between log scale and linear scale
  const updatemenus = [
    {
      type: "buttons",
      x: 0,
      y: -0.3,
      xanchor: "left",
      yanchor: "top",
      pad: { r: 10, t: 10 },
      direction: "left",
      showactive: true,
      buttons: [
        {
          label: "Linear Scale",
          //passing title to every scale
          args: [
            {
              yaxis: {
                type: "linear",
                title: {
                  text: `${modeLabel}${
                    data.units.length ? " (" + data.units + ")" : ""
                  }`,
                },
              },
            },
          ],
          method: "relayout",
        },
        {
          label: "Log Scale",
          args: [
            {
              yaxis: {
                type: "log",
                title: {
                  text: `${modeLabel}${
                    data.units.length ? " (" + data.units + ")" : ""
                  }`,
                },
              },
            },
          ],
          method: "relayout",
        },
      ],
    },
  ];
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
              title: {
                text: `${modeLabel}${
                  data.units.length ? " (" + data.units + ")" : ""
                }`,
              },
              type: "linear",
              autorange: true,
              fixedrange: false,
            },
            updatemenus,
          }}
        />
      }
    </>
  );
};

export const CalcSpectrumPlot = React.memo(CalcSpectrumPlot_);
