import { IconButton, Grid, TextField } from "@material-ui/core";
import React from "react";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import { Controller, Control, useFieldArray } from "react-hook-form";
import { ValidationErrors } from "../../../constants";
import { MoleculeSelector } from "../MoleculeSelector";
import "./index.css";
import { FormValues } from "../../types";

export interface SpeciesProps {
  validationErrors: ValidationErrors;
  control: Control<FormValues>;
}

export const Species: React.FC<SpeciesProps> = ({
  validationErrors,
  control,
}) => {
  const { fields, append, remove } = useFieldArray<FormValues>({
    control,
    name: "species",
  });
  return (
    <Grid container spacing={3}>
      {fields.map((field, index) => (
        <React.Fragment key={field.id}>
          <Grid item xs={7}>
            <Controller
              name={`species.${index}.molecule` as any}
              control={control}
              defaultValue={field.mole_fraction}
              rules={{ required: "Molecule is required" }}
              render={({ field: { onChange, value } }) => (
                <MoleculeSelector
                  validationError={validationErrors.molecule[index]}
                  autofocus={index !== 0}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Controller
              name={`species.${index}.mole_fraction` as any}
              control={control}
              defaultValue={field.mole_fraction}
              rules={{ required: "Mole fraction is required" }}
              render={({ field: { onChange, value } }) => (
                <TextField
                  fullWidth
                  id="mole-fraction-input"
                  label="Mole Fraction"
                  error={validationErrors.mole_fraction[index] !== undefined}
                  value={value}
                  type="number"
                  onChange={(e) => {
                    onChange(parseFloat(e.target.value));
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={2}>
            {index === 0 ? (
              <IconButton
                color="primary"
                onClick={() =>
                  append({ molecule: undefined, mole_fraction: undefined })
                }
              >
                <AddIcon />
              </IconButton>
            ) : (
              <IconButton
                color="primary"
                disabled={fields.length === 1}
                onClick={() => {
                  remove(index);
                }}
              >
                <CloseIcon />
              </IconButton>
            )}
          </Grid>
        </React.Fragment>
      ))}
    </Grid>
  );
};
