import React from "react";
import Input from "@mui/joy/Input";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import { Control, Controller } from "react-hook-form";
import { FormValues } from "../types";
import { PathLengthUnit } from "./PathLengthUnits";
import Divider from "@mui/joy/Divider";
interface TGasProps {
  control: Control<FormValues>;
}
export const PathLength: React.FC<TGasProps> = ({ control }) => (
  <Controller
    render={({ field, formState }) => (
      <FormControl>
        <FormLabel>Path Length</FormLabel>
        <Input
          {...field}
          {...formState}
          type="number"
          onChange={field.onChange}
          value={field.value}
          error={!!formState.errors?.path_length}
          endDecorator={
            <React.Fragment>
              <Divider orientation="vertical" />
              <PathLengthUnit control={control} />
            </React.Fragment>
          }
        />
        {formState.errors?.path_length ? (
          <FormHelperText
            sx={{
              color: "red",
            }}
          >
            {formState.errors?.path_length?.message}
          </FormHelperText>
        ) : null}
      </FormControl>
    )}
    name="path_length"
    control={control}
    defaultValue={1}
  />
);
