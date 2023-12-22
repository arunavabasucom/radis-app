import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
// import FormLabel from "@mui/joy/FormLabel";
import FormControl from "@mui/joy/FormControl";
import { Control, Controller } from "react-hook-form";
import { FormValues } from "../types";

interface PressureUnitsProps {
  control: Control<FormValues>;
}

export const PressureUnit: React.FC<PressureUnitsProps> = ({ control }) => {
  return (
    <FormControl>
      <Controller
        name="pressure_units"
        defaultValue="u.bar"
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
            <Option value={"u.bar"}>bar</Option>
            <Option value={"u.mbar"}>mbar</Option>
            <Option value={"cds.atm"}>atm</Option>
            <Option value={"u.torr"}>torr</Option>
            <Option value={"u.mTorr"}>mTorr</Option>
            <Option value={"u.Pa"}>Pa</Option>
          </Select>
        )}
      />
    </FormControl>
  );
};
