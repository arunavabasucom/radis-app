import React from "react";
import Input from "@mui/joy/Input";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import { Controller, useFormContext } from "react-hook-form";
import Divider from "@mui/joy/Divider";
import { PathLengthUnit } from "./PathLengthUnits";
import useFromStore from "../../store/form";

export const PathLength: React.FC = () => {
  const { control } = useFormContext();
  const { formMode } = useFromStore();

  return (
    <Controller
      render={({ field, fieldState }) => (
        <FormControl>
          <FormLabel>Path Length</FormLabel>
          <Input
            {...field}
            type="number"
            onChange={field.onChange}
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
            <FormHelperText
              sx={{
                color: "red",
              }}
            >
              {fieldState.error.message}
            </FormHelperText>
          ) : null}
        </FormControl>
      )}
      name={formMode === "calc" ? "path_length" : "experimental_conditions.path_length"}
      control={control}
      defaultValue={1}
    />
  );
};
