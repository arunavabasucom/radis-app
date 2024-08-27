import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import FormControl from "@mui/joy/FormControl";
import {  Controller, useFormContext } from "react-hook-form";




export const WaveLengthUnit: React.FC = () => {
  const { control } = useFormContext();
  
  
  return (
    <FormControl>
      <Controller
        name="wavelength_units"
        defaultValue="1/u.cm"
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
            <Option value={"1/u.cm"}>cm⁻¹</Option>
            <Option value={"u.nm"}>nm</Option>
          </Select>
        )}
      />
    </FormControl>
  );
};
