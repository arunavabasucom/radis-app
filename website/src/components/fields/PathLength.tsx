import { TextField, InputAdornment } from "@material-ui/core";
import React from "react";
import { Controller, Control } from "react-hook-form";
import { ValidationErrors } from "../../constants";
import { FormValues } from "../types";

interface PathLengthProps {
  validationErrors: ValidationErrors;
  control: Control<FormValues>;
}

export const PathLength: React.FC<PathLengthProps> = ({
  validationErrors,
  control,
}) => (
  <Controller
    name="path_length"
    control={control}
    defaultValue={1}
    render={({ field: { onChange, value } }) => (
      <TextField
        fullWidth
        id="path-length-input"
        value={value}
        type="number"
        helperText={validationErrors.path_length}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        InputProps={{
          endAdornment: <InputAdornment position="end">cm</InputAdornment>,
        }}
        label="Path length"
      />
    )}
  />
);
