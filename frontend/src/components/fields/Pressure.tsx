import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import Input from "@mui/joy/Input";
import { Controller, useFormContext } from "react-hook-form";

import { PressureUnit } from "./PressureUnits";
import Divider from "@mui/joy/Divider";

export const Pressure: React.FC = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name="pressure"
      control={control}
      defaultValue={1.01325}
      render={({ field, fieldState }) => (
        <FormControl>
          <FormLabel>Pressure</FormLabel>
          <Input
            {...field}
            id="pressure-input"
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
