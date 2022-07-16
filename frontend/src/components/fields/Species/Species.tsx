import React from "react";
import "./index.css";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {
  Controller,
  Control,
  FieldValues,
  useFieldArray,
} from "react-hook-form";
import { MoleculeSelector } from "../MoleculeSelector/MoleculeSelector";

export interface SpeciesProps {
  validationErrors?: string;
  control: Control<FieldValues>;
  isNonEquilibrium: boolean;
  isGeisa: boolean;
}

export const Species: React.FC<SpeciesProps> = ({
  control,
  // validationErrors,
  isNonEquilibrium,
  isGeisa,
}) => {
  const { fields, append, remove } = useFieldArray<FieldValues>({
    control,
    name: "species",
  });
  return (
    <Grid container spacing={3}>
      {fields.map((field, index) => (
        <React.Fragment key={field.id}>
          <Grid item xs={7}>
            <Controller
              name={`species.${index}.molecule` as string}
              control={control}
              rules={{ required: "Molecule is required" }}
              render={({ field }) => (
                <MoleculeSelector
                  // validationError=""
                  control={control}
                  value={field.value}
                  onChange={field.onChange}
                  autofocus={index !== 0}
                  isNonEquilibrium={isNonEquilibrium}
                  isGeisa={isGeisa}
                />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Controller
              name={`species.${index}.mole_fraction` as string}
              control={control}
              rules={{ required: "Mole fraction is required" }}
              render={({ field: { onChange, value } }) => (
                <TextField
                  fullWidth
                  id="mole-fraction-input"
                  label="Mole Fraction"
                  // error={validationErrors.mole_fraction[index] !== undefined}
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
                onClick={() => append({ molecule: "CO", mole_fraction: 0.1 })}
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
