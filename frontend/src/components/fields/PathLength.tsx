import React from "react";
import Input from "@mui/joy/Input";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import Divider from "@mui/joy/Divider";
import { Controller, useFormContext } from "react-hook-form";
import { PathLengthUnit } from "./PathLengthUnits";

export const PathLength: React.FC = () => {
  const { control } = useFormContext();

  return (
    <Controller
      render={({ field, fieldState }) => (
        <FormControl>
          <FormLabel>Path Length</FormLabel>
          <Input
            {...field}
            type="number"
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (value >= 0 || e.target.value === "") {
                field.onChange(value);
              }
            }}
            value={field.value}
            error={!!fieldState.error}
            endDecorator={
              <div>
                <Divider orientation="vertical" />
                <PathLengthUnit />
              </div>
            }
          />
          {fieldState.error ? (
            <FormHelperText sx={{ color: "red" }}>
              {fieldState.error.message}
            </FormHelperText>
          ) : null}
        </FormControl>
      )}
      name="path_length"
      control={control}
      defaultValue={1}
      rules={{
        min: { value: 0, message: "Path Length cannot be negative" },
      }}
    />
  );
};
