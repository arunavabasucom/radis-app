import { FormControlLabel, Switch } from "@material-ui/core";
import React from "react";
import { CalcSpectrumParams } from "../constants";

interface SimulateSlitProps {
  params: CalcSpectrumParams;
  setParams: (params: CalcSpectrumParams) => void;
}

const SimulateSlit: React.FC<SimulateSlitProps> = ({ params, setParams }) => {
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
      label="Simulate an experimental slit"
    />
  );
};

export default SimulateSlit;
