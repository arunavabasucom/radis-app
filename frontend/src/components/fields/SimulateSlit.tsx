import React from "react";

import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import { CalcSpectrumParams } from "../../constants";

interface SimulateSlitProps {
  params: CalcSpectrumParams;
  setParams: (params: CalcSpectrumParams) => void;
}

export const SimulateSlit: React.FC<SimulateSlitProps> = ({
  params,
  setParams,
}) => {
  return (
    <FormControlLabel
      control={
        <Switch
          checked={params.simulate_slit}
          onChange={() =>
            setParams({ ...params, simulate_slit: !params.simulate_slit })
          }
        />
      }
      label="Simulate a 5 nm instrumental slit"
    />
  );
};
