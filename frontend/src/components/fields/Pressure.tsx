import React, { ReactNode } from "react";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import Input from "@mui/joy/Input";
import { Control, Controller } from "react-hook-form";
import { FormValues } from "../types";
import { PressureUnit } from "./PressureUnits";
import Divider from "@mui/joy/Divider";
interface TGasProps {
  control: Control<FormValues>;
}
export const Pressure: React.FC<TGasProps> = ({ control }) => (
  <Controller
    render={({ field, formState }) => (
      <FormControl>
        <FormLabel>Pressure</FormLabel>
        <Input
          {...field}
          {...formState}
          id="pressure-input"
          type="number"
          onChange={field.onChange}
          value={field.value}
          error={!!formState.errors?.pressure}
          endDecorator={
            <React.Fragment>
              <Divider orientation="vertical" />
              <PressureUnit control={control} />
            </React.Fragment>
          }
          sx={{ width: 200 }}
        />
        {formState.errors?.pressure ? (
          <FormHelperText
            sx={{
              color: "red",
            }}
          >
            {formState.errors?.pressure?.message}
          </FormHelperText>
        ) : null}
      </FormControl>
    )}
    name="pressure"
    control={control}
    defaultValue={1.01325}
  />
);
