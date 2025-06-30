import React from "react";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import FormControl from "@mui/joy/FormControl";
import { Controller, useFormContext } from "react-hook-form";
import useFromStore from "../../store/form";

export const WaveLengthUnit: React.FC = () => {
  const { control } = useFormContext();
  const { formMode } = useFromStore();

  return (
    <FormControl>
      <Controller
        name={formMode === "calc" ? "wavelength_units" : "experimental_conditions.wavelength_units"}
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
