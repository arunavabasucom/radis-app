import Input from "@mui/joy/Input";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import { Controller, useFormContext } from "react-hook-form";


export interface TVibProps {
  updateFieldValue: (key: string, value: any) => void;
}

export const TVib: React.FC<TVibProps> = ({updateFieldValue}) => {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name="tvib"
      control={control}
      defaultValue={300}
      render={({ field, fieldState }) => (
        <FormControl>
          <FormLabel>TVib</FormLabel>
          <Input
            {...field}
            id="tvib-input"
            type="number"
            onChange={(e) => {
              field.onChange(Number(e.target.value));
              setValue("tvib", e.target.value);
              updateFieldValue("tvib", Number(e.target.value));
            }}
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
