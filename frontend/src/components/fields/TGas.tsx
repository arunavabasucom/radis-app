import Input from "@mui/joy/Input";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import {  Controller, useFormContext } from "react-hook-form";

export interface TGasProps {
  updateFieldValue: (key: string, value: any) => void;
}

export const TGas: React.FC<TGasProps> = ({updateFieldValue}) => {
  const { control } = useFormContext();
  return (
    <Controller
      name="tgas"
      control={control}
      defaultValue={300}
      render={({ field, fieldState }) => (
        <FormControl>
          <FormLabel>TGas</FormLabel>
          <Input
            {...field}
            id="tgas-input"
            type="number"
            onChange={(e) => {
              field.onChange(Number(e.target.value));
              updateFieldValue("tgas", Number(e.target.value));
            }
              
            }
            value={field.value}
            error={!!fieldState.error}
            endDecorator={"k"}
            onKeyPress={(event: any) => {
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
