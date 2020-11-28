import React from "react";
import Plot from "react-plotly.js";
import { CalcSpectrumResponseData, palette } from "../constants";
import { addSubscriptsToMolecule } from "../utils";

interface CalcSpectrumPlotProps {
  data: CalcSpectrumResponseData;
  molecule: string;
}

const CalcSpectrumPlot: React.FC<CalcSpectrumPlotProps> = ({
  data,
  molecule,
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
      title: `Spectrum for ${addSubscriptsToMolecule(molecule)}`,
      font: { family: "Roboto", color: "#000" },
      xaxis: {
        title: { text: "Wavenumber (cm⁻¹)" },
      },
      yaxis: {
        title: { text: "Radiance (mW/cm²/sr/nm)" },
      },
    }}
  />
);

export default CalcSpectrumPlot;
