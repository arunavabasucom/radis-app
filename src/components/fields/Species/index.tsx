import { IconButton, Grid, TextField } from "@material-ui/core";
import React from "react";
import { CalcSpectrumParams, ValidationErrors } from "../../../constants";
import { MoleculeSelector } from "../MoleculeSelector";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import "./index.css";

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
    <Grid container spacing={1} alignItems="flex-end">
      {params.species.map((species, index) => (
        <>
          <Grid item xs={7}>
            <MoleculeSelector
              index={index}
              params={params}
              setParams={setParams}
              moleculeValidationErrors={validationErrors.molecule}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="mole-fraction-input"
              label="Mole Fraction"
              error={validationErrors.mole_fraction[index] !== undefined}
              value={species.mole_fraction}
              type="number"
              onChange={(event) => {
                const newSpecies = [...params.species];
                newSpecies[index] = {
                  ...newSpecies[index],
                  mole_fraction: parseFloat(event.target.value),
                };
                setParams({
                  ...params,
                  species: newSpecies,
                });
              }}
            />
          </Grid>
          <Grid item xs={1}>
            {index === 0 ? (
              <IconButton
                color="primary"
                style={{ marginTop: 10, marginRight: 20 }}
                onClick={() =>
                  setParams({
                    ...params,
                    species: [
                      ...params.species,
                      { molecule: undefined, mole_fraction: undefined },
                    ],
                  })
                }
              >
                <AddIcon />
              </IconButton>
            ) : (
              <IconButton
                color="primary"
                disabled={params.species.length === 1}
                onClick={() => {
                  const newSpecies = [...params.species];
                  newSpecies.splice(index, 1);
                  setParams({
                    ...params,
                    species: newSpecies,
                  });
                }}
              >
                <CloseIcon />
              </IconButton>
            )}
          </Grid>
        </>
      ))}
    </Grid>
  );
};
