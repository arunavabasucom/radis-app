import Input from "@mui/joy/Input";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import React, { ReactNode } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import { Control, Controller } from "react-hook-form";
import { FormValues } from "../types";

interface TRotProps {
  control: Control<FormValues>;
}
export const TRot: React.FC<TRotProps> = ({ control }) => (
  <Controller
    render={({ field, formState }) => (
      <FormControl>
        <FormLabel>TGas</FormLabel>
        <Input
          {...field}
          {...formState}
          id="trot-input"
          type="number"
          onChange={field.onChange}
          value={field.value}
          error={!!formState.errors?.trot}
          endDecorator={<InputAdornment position="end">K</InputAdornment>}
          onKeyPress={(event: any) => {
            if (event?.key === "-" || event?.key === "+") {
              event.preventDefault();
            }
          }}
        />
        {formState.errors?.trot ? (
          <FormHelperText
            sx={{
              color: "red",
            }}
          >
            {formState.errors?.trot?.message}
          </FormHelperText>
        ) : null}
      </FormControl>
    )}
    name="trot"
    control={control}
    defaultValue={300}
  />
);
