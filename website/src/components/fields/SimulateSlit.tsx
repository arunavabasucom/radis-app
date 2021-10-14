import { FormControlLabel, Switch } from "@material-ui/core";
import React from "react";
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
      label="Simulate a 1.5 nm instrumental slit"
    />
  );
};
