import { Grid, TextField } from "@material-ui/core";
import React from "react";
import { CalcSpectrumParams, ValidationErrors } from "../../constants";
import { MoleculeSelector } from "./MoleculeSelector";

interface SpeciesProps {
  params: CalcSpectrumParams;
  setParams: (params: CalcSpectrumParams) => void;
  validationErrors: ValidationErrors;
}

export const Species: React.FC<SpeciesProps> = ({
  params,
  setParams,
  validationErrors,
}) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={8}>
        <MoleculeSelector
          params={params}
          setParams={setParams}
          moleculeValidationError={validationErrors.molecule}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          id="mole-fraction-input"
          error={validationErrors.mole_fraction !== undefined}
          value={params.mole_fraction}
          type="number"
          helperText={validationErrors.mole_fraction}
          onChange={(event) =>
            setParams({
              ...params,
              mole_fraction: parseFloat(event.target.value),
            })
          }
          label="Mole fraction"
        />
      </Grid>
    </Grid>
  );
};
