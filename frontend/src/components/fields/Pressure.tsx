import React from "react"; // Add this line

import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import Input from "@mui/joy/Input";
import { Controller, useFormContext } from "react-hook-form";

import Divider from "@mui/joy/Divider";
import { PressureUnit } from "./PressureUnits";
import { FitCheckbox } from "./FitCheckbox";
import useFromStore from "../../store/form";
import useFitFormStore from "../../store/fitForm";

export const Pressure: React.FC = () => {
  const { control } = useFormContext();
  const { formMode } = useFromStore();
  const { selected_fit_parameters } = useFitFormStore();

  return (
    <Controller
      name={formMode === "calc" ? "pressure" : selected_fit_parameters?.pressure ? "fit_parameters.pressure" : "experimental_conditions.pressure"}
      control={control}
      defaultValue={1.01325}
      render={({ field, fieldState }) => (
        <FormControl>
          <FitCheckbox fitParameter="pressure" />
          <Input
            {...field}
            id="pressure-input"
            data-testid="pressure-input-testid"
            type="number"
            onChange={field.onChange}
            value={field.value}
            error={!!fieldState.error}
            endDecorator={
              <div>
                <Divider orientation="vertical" />
                <PressureUnit />
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
    />
  );
};
