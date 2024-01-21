import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import { Controller, useFormContext } from "react-hook-form";

export const PressureUnit: React.FC = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name="pressure_units"
      defaultValue="u.bar"
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
          <Option value={"u.bar"}>bar</Option>
          <Option value={"u.mbar"}>mbar</Option>
          <Option value={"cds.atm"}>atm</Option>
          <Option value={"u.torr"}>torr</Option>
          <Option value={"u.mTorr"}>mTorr</Option>
          <Option value={"u.Pa"}>Pa</Option>
        </Select>
      )}
    />
  );
};
