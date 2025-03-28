import Input from "@mui/joy/Input";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";

import InputAdornment from "@mui/material/InputAdornment";
import { Controller, useFormContext } from "react-hook-form";


export interface TRotProps {
  updateFieldValue: (key: string, value: any) => void;
}

export const TRot: React.FC<TRotProps> = ({updateFieldValue}) => {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name="trot"
      control={control}
      defaultValue={300}
      render={({ field, fieldState }) => (
        <FormControl>
          <FormLabel>TRot</FormLabel>
          <Input
            {...field}
            id="trot-input"
            type="number"
            onChange={(e) => {
              field.onChange(Number(e.target.value));
              setValue("trot", e.target.value);
              updateFieldValue("trot", Number(e.target.value));
            }}
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
    />
  );
};
