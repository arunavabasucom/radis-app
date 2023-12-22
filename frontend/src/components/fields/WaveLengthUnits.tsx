import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import FormControl from "@mui/joy/FormControl";
import { Control, Controller } from "react-hook-form";
import { FormValues } from "../types";

interface WaveLengthUnProps {
  control: Control<FormValues>;
}

export const WaveLengthUnit: React.FC<WaveLengthUnProps> = ({ control }) => {
  return (
    <FormControl>
      <Controller
        name="wavelength_units"
        defaultValue="1/u.cm"
        control={control}
        render={({ field, formState }) => (
          <Select
            {...field}
            {...formState}
            id="mode-select"
            onChange={(_, value) => {
              field.onChange(value);
            }}
            value={field.value}
            style={{ marginTop: "36px" }}
          >
            <Option value={"1/u.cm"}>cm⁻¹</Option>
            <Option value={"u.nm"}>nm</Option>
          </Select>
        )}
      />
    </FormControl>
  );
};
