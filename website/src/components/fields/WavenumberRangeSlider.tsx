import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Input from "@material-ui/core/Input";
import { Control, Controller, UseFormSetValue } from "react-hook-form";
import { FormValues } from "../types";

interface WavelengthRangeSliderProps {
  minRange: number;
  maxRange: number;
  control: Control<FormValues>;
  setValue: UseFormSetValue<FormValues>;
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
}) => {
  const classes = useStyles();
  const [lowerRange, setLowerRange] = useState<number | "">(1900);
  const [upperRange, setUpperRange] = useState<number | "">(2300);

  // TOOD: Would be better to just store as a number everywhere instead of
  // checking if it's an empty string
  useEffect(() => {
    setValue("min_wavenumber_range", lowerRange === "" ? minRange : lowerRange);
    setValue("max_wavenumber_range", upperRange === "" ? maxRange : upperRange);
  }, [lowerRange, upperRange]);

  const handleSliderChange = (
    // eslint-disable-next-line @typescript-eslint/ban-types
    _event: React.ChangeEvent<{}>,
    value: number | number[]
  ) => {
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
        Wavenumber range (cm⁻¹)
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
