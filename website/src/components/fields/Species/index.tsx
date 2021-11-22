import { IconButton, Grid, TextField } from "@material-ui/core";
import React from "react";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import { CalcSpectrumParams, ValidationErrors } from "../../../constants";
import { MoleculeSelector } from "../MoleculeSelector";
import "./index.css";
import { removeSubscriptsFromMolecule } from "../../../utils";

export interface SpeciesProps {
  value: CalcSpectrumParams["species"];
  setValue: (value: CalcSpectrumParams["species"]) => void;
  validationErrors: ValidationErrors;
}

export const Species: React.FC<SpeciesProps> = ({
  value,
  setValue,
  validationErrors,
}) => {
  return (
    <Grid container spacing={3}>
      {value.map((specie, index) => (
        <>
          <Grid item xs={7}>
            <MoleculeSelector
              molecule={value[index].molecule || ""}
              validationError={validationErrors.molecule[index]}
              handleChange={(
                _: React.ChangeEvent<Record<string, string>>,
                eventValue: string | null
              ) => {
                const newSpecies = [...value];
                newSpecies[index] = {
                  ...newSpecies[index],
                  molecule: eventValue
                    ? removeSubscriptsFromMolecule(eventValue)
                    : "",
                };
                setValue(newSpecies);
              }}
              autofocus={index !== 0}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              id="mole-fraction-input"
              label="Mole Fraction"
              error={validationErrors.mole_fraction[index] !== undefined}
              value={specie.mole_fraction}
              type="number"
              inputProps={{
                step: "any",
              }}
              onChange={(event) => {
                const newSpecies = [...value];
                newSpecies[index] = {
                  ...newSpecies[index],
                  mole_fraction: parseFloat(event.target.value),
                };
                setValue(newSpecies);
              }}
            />
          </Grid>
          <Grid item xs={2}>
            {index === 0 ? (
              <IconButton
                color="primary"
                onClick={() =>
                  setValue([
                    ...value,
                    { molecule: undefined, mole_fraction: undefined },
                  ])
                }
              >
                <AddIcon />
              </IconButton>
            ) : (
              <IconButton
                color="primary"
                disabled={value.length === 1}
                onClick={() => {
                  const newSpecies = [...value];
                  newSpecies.splice(index, 1);
                  setValue(newSpecies);
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
