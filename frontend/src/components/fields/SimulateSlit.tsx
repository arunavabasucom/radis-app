import React from "react";
import Input from "@mui/joy/Input";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import { Controller, useFormContext } from "react-hook-form";
import useFromStore from "../../store/form";

export const SimulateSlit: React.FC = () => {
  const { control } = useFormContext();
  const { simulateSlitUnit } = useFromStore();
  const { formMode } = useFromStore();

  return (
    <Controller
      render={({ field, fieldState }) => (
        <FormControl>
          <FormLabel>Slit Size</FormLabel>
          <Input
            {...field}
            id="simulate_slit"
            type="number"
            onChange={field.onChange}
            value={field.value}
            error={!!fieldState.error}
            endDecorator={simulateSlitUnit ? "nm" : "cm-1"}
            onKeyPress={(event) => {
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
      name={formMode === "calc" ? "simulate_slit" : "experimental_conditions.simulate_slit"}
      control={control}
      defaultValue={5}
    />
  );
};
