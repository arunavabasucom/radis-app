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
          checked={params.simulateSlit}
          onChange={() =>
            setParams({ ...params, simulateSlit: !params.simulateSlit })
          }
        />
      }
      label="Simulate an experimental slit"
    />
  );
};

export default SimulateSlit;
