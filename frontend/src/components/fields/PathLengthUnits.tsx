import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import FormControl from "@mui/joy/FormControl";
import { Control, Controller } from "react-hook-form";
import { FormValues } from "../types";

interface PathLengthUnitsProps {
  control: Control<FormValues>;
}

export const PathLengthUnit: React.FC<PathLengthUnitsProps> = ({ control }) => {
  return (
    <FormControl>
      <Controller
        name="path_length_units"
        defaultValue="u.cm"
        control={control}
        render={({ field, formState }) => (
          <Select
            {...field}
            {...formState}
            variant="plain"
            id="mode-select"
            onChange={(_, value) => {
              field.onChange(value);
            }}
            value={field.value}
            slotProps={{
              listbox: {
                variant: "outlined",
              },
            }}
            sx={{ mr: -1.5, "&:hover": { bgcolor: "transparent" } }}
          >
            <Option value={"u.cm"}>cm</Option>
            <Option value={"u.m"}>m</Option>
            <Option value={"u.km"}>km</Option>
          </Select>
        )}
      />
    </FormControl>
  );
};
