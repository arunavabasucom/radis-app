import React from "react";
import "./index.css";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

import { CalcSpectrumParams, ValidationErrors } from "../../../constants";
import { MoleculeSelector } from "../MoleculeSelector";
import { removeSubscriptsFromMolecule } from "../../../utils";

export interface SpeciesProps {
  params: CalcSpectrumParams;
  setParams: (params: CalcSpectrumParams) => void;
  validationErrors: ValidationErrors;
  isNonEquilibrium: boolean;
  isGeisa: boolean;
}

export const Species: React.FC<SpeciesProps> = ({
  params,
  setParams,
  validationErrors,
  isNonEquilibrium,
  isGeisa,
}) => {
  return (
    <Grid container spacing={3}>
      {params.species.map((species, index) => (
        <>
          <Grid item xs={6}>
            <MoleculeSelector
              molecule={params.species[index].molecule || ""}
              validationError={validationErrors.molecule[index]}
              handleChange={(
                _: React.SyntheticEvent<Element, Event>,
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
              isNonEquilibrium={isNonEquilibrium}
              isGeisa={isGeisa}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              variant="standard"
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
