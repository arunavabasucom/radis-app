import Input from "@mui/joy/Input";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import {  Controller, useFormContext } from "react-hook-form";
import { PathLengthUnit } from "./PathLengthUnits";
import Divider from "@mui/joy/Divider";

export interface PathLengthProps {
  updateFieldValue: (key: string, value: any) => void;
}

export const PathLength: React.FC<PathLengthProps> = ({updateFieldValue}) => {
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
              field.onChange(Number(e.target.value));
              updateFieldValue("path_length", Number(e.target.value));
            }}
            value={field.value}
            error={!!fieldState.error}
            endDecorator={
              <div>
                <Divider orientation="vertical" />
                <PathLengthUnit  
                  updateFieldValue={updateFieldValue}
                />
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
