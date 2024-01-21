import Input from "@mui/joy/Input";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";
import {  Controller, useFormContext } from "react-hook-form";



export const TGas: React.FC = () => {
  const { control } = useFormContext();
  return (
    <Controller
      render={({ field, fieldState }) => (
        <FormControl>
          <FormLabel>TGas</FormLabel>
          <Input
            {...field}
            id="tgas-input"
            type="number"
            onChange={field.onChange}
            value={field.value}
            error={!!fieldState.error}
            endDecorator={<InputAdornment position="end">K</InputAdornment>}
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
      name="tgas"
      control={control}
      defaultValue={300}
    />
  );
};
