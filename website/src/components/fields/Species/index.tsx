import { IconButton, Grid, TextField } from "@material-ui/core";
import React from "react";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import { CalcSpectrumParams, ValidationErrors } from "../../../constants";
import { MoleculeSelector } from "../MoleculeSelector";
import "./index.css";
import { removeSubscriptsFromMolecule } from "../../../utils";

export interface SpeciesProps {
  params: CalcSpectrumParams;
  setParams: (params: CalcSpectrumParams) => void;
  validationErrors: ValidationErrors;
  isNonquilibrium: boolean;
}

export const Species: React.FC<SpeciesProps> = ({
  params,
  setParams,
  validationErrors,
  isNonquilibrium,
}) => {
  return (
    <Grid container spacing={3}>
      {params.species.map((species, index) => (
        <>
          <Grid item xs={7}>
            <MoleculeSelector
              molecule={params.species[index].molecule || ""}
              validationError={validationErrors.molecule[index]}
              handleChange={(
                _: React.ChangeEvent<Record<string, string>>,
                value: string | null
              ) => {
                const newSpecies = [...params.species];
                newSpecies[index] = {
                  ...newSpecies[index],
                  molecule: value ? removeSubscriptsFromMolecule(value) : "",
                };
                setParams({
                  ...params,
                  species: newSpecies,
                });
              }}
              autofocus={index !== 0}
              isNonquilibrium={isNonquilibrium}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              id="mole-fraction-input"
              label="Mole Fraction"
              error={validationErrors.mole_fraction[index] !== undefined}
              value={species.mole_fraction}
              type="number"
              inputProps={{
                step: "any",
              }}
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
          <Grid item xs={2}>
            {index === 0 ? (
              <IconButton
                color="primary"
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
