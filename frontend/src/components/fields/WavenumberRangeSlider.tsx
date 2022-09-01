import React from "react";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import Input from "@mui/material/Input";
import { Control, Controller, UseFormSetValue } from "react-hook-form";
import Grid from "@mui/material/Grid";
import { makeStyles } from "@mui/styles";
import { FormValues } from "../types";

interface WavelengthRangeSliderProps {
  minRange: number;
  maxRange: number;
  control: Control<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  isUnitChanged: boolean;
}
const useStyles = makeStyles({
  input: {
    width: 52,
  },
});
export const WavenumberRangeSlider: React.FC<WavelengthRangeSliderProps> = ({
  minRange,
  maxRange,
  control,
  setValue,
  isUnitChanged,
}) => {
  const classes = useStyles();
  const [lowerRange, setLowerRange] = React.useState<number | "">(1900);
  const [upperRange, setUpperRange] = React.useState<number | "">(2300);
  React.useEffect(() => {
    setValue("min_wavenumber_range", lowerRange === "" ? minRange : lowerRange);
    setValue("max_wavenumber_range", upperRange === "" ? maxRange : upperRange);
  }, [lowerRange, upperRange, setValue, minRange, maxRange]);
  const handleSliderChange = (_event: Event, value: number | number[]) => {
    value = value as [number, number];
    setLowerRange(value[0]);
    setUpperRange(value[1]);
  };
  const handleBlur = () => {
    if (lowerRange > upperRange) {
      return;
    }
    if (lowerRange < minRange) {
      setLowerRange(minRange);
    }
    if (upperRange > maxRange) {
      setUpperRange(maxRange);
    }
  };
  const rangeInput = (
    id: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (...event: any[]) => void,
    value:
      | FormValues["min_wavenumber_range"]
      | FormValues["max_wavenumber_range"]
  ) => (
    <Input
      fullWidth
      id={id}
      className={classes.input}
      value={value}
      margin="dense"
      onChange={(e) =>
        onChange(e.target.value === "" ? "" : Number(e.target.value))
      }
      onBlur={handleBlur}
      inputProps={{
        min: minRange,
        max: maxRange,
        type: "number",
        "aria-labelledby": "input-slider",
      }}
    />
  );

  return (
    <div>
      <Typography id="input-slider" gutterBottom>
        {isUnitChanged ? " Wavelength range (nm)" : " Wavenumber range (cm⁻¹)"}
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Controller
            name="min_wavenumber_range"
            control={control}
            defaultValue={minRange}
            render={({ field: { onChange, value } }) =>
              rangeInput("min-wavenumber-input", onChange, value)
            }
          />
        </Grid>
        <Grid item xs>
          <Slider
            value={[
              lowerRange === "" ? minRange : lowerRange,
              upperRange === "" ? maxRange : upperRange,
            ]}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            min={minRange}
            max={maxRange}
          />
        </Grid>
        <Grid item>
          <Controller
            name="max_wavenumber_range"
            control={control}
            defaultValue={maxRange}
            render={({ field: { onChange, value } }) =>
              rangeInput("max-wavenumber-input", onChange, value)
            }
          />
        </Grid>
      </Grid>
    </div>
  );
};
