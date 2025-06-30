import React from "react";
import Input from "@mui/joy/Input";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import { Controller, useFormContext } from "react-hook-form";
import { FitCheckbox } from "./FitCheckbox";
import useFromStore from "../../store/form";

export const TVib: React.FC = () => {
  const { control } = useFormContext();
  const { formMode } = useFromStore();

  return (
    <Controller
      name={formMode === "calc" ? "tvib" : "fit_parameters.tvib"}
      control={control}
      defaultValue={300}
      render={({ field, fieldState }) => (
        <FormControl>
          <FitCheckbox fitParameter="tvib" />
          <Input
            {...field}
            id="tvib-input"
            data-testid="tvib-testid"
            type="number"
            onChange={field.onChange}
            value={field.value}
            error={!!fieldState.error}
            endDecorator={"k"}
            onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) => {
              if (event?.key === "-" || event?.key === "+") {
                event.preventDefault();
              }
            }}
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
    />
  );
};
