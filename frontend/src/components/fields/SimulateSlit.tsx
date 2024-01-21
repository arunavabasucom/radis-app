import React from "react";
import Input from "@mui/joy/Input";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";
import { Control, Controller } from "react-hook-form";
import { FormValues } from "../types";
interface SimulateSlitProps {
  control: Control<FormValues>;
  isUnitChangeable: boolean;
}
export const SimulateSlit: React.FC<SimulateSlitProps> = ({
  control,
  isUnitChangeable,
}) =>

(
  <Controller
    render={({ field, formState }) => (
      <FormControl>
        <FormLabel>Slit Size</FormLabel>
        <Input
          {...field}
          {...formState}
          id="simulate_slit"
          type="number"
          onChange={field.onChange}
          value={field.value}
          error={!!formState.errors?.simulate_slit}
          endDecorator={
            isUnitChangeable ? (
              <InputAdornment position="end">nm</InputAdornment>
            ) : (
              <InputAdornment position="end">cm-1</InputAdornment>
            )
          }
          onKeyPress={(event) => {
            if (event?.key === "-" || event?.key === "+") {
              event.preventDefault();
            }
          }}
        />
        {formState.errors?.simulate_slit ? (
          <FormHelperText
            sx={{
              color: "red",
            }}
          >
            {formState.errors?.simulate_slit?.message}
          </FormHelperText>
        ) : null}
      </FormControl>
    )}
    name="simulate_slit"
    control={control}
    defaultValue={5}
  />
);
