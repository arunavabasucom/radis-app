import Input from "@mui/joy/Input";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import {  Controller, useFormContext } from "react-hook-form";
import { PathLengthUnit } from "./PathLengthUnits";
import Divider from "@mui/joy/Divider";

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
            onChange={field.onChange}
            value={field.value}
            error={!!fieldState.error}
            endDecorator={
              <div>
                <Divider orientation="vertical" />
                <PathLengthUnit  />
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
      name="path_length"
      control={control}
      defaultValue={1}
    />
  );
};
