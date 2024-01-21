import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import FormControl from "@mui/joy/FormControl";
import {  Controller, useFormContext } from "react-hook-form";



export const PathLengthUnit: React.FC = () => {
  const { control } = useFormContext();
  return (
    <FormControl>
      <Controller
        name="path_length_units"
        defaultValue="u.cm"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
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
