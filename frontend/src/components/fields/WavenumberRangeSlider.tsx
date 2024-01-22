import React from "react";
import Slider from "@mui/joy/Slider";
import Input from "@mui/joy/Input";
import {
  Controller,
  useFormContext,
} from "react-hook-form";
import Grid from "@mui/material/Grid";

import { FormValues } from "../types";
import Divider from "@mui/joy/Divider";
import { WaveLengthUnit } from "./WaveLengthUnits";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import useFromStore from "../../store/form";

export const WavenumberRangeSlider: React.FC = () => {
  const { control, setValue } = useFormContext();
  const { simulateSlitUnit: isUnitChanged } = useFromStore();
  const minRange = isUnitChanged ? 1000 : 500;
  const maxRange = isUnitChanged ? 20000 : 10000;

  const [lowerRange, setLowerRange] = React.useState<number | any>(1900);
  const [upperRange, setUpperRange] = React.useState<number | any>(2300);

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
      id={id}
      value={value}
      onChange={(e) =>
        onChange(e.target.value === "" ? "" : Number(e.target.value))
      }
      sx={{ width: 150 }}
      onBlur={handleBlur}
      endDecorator={
        <React.Fragment>
          <Divider orientation="vertical" />
          <WaveLengthUnit  />
        </React.Fragment>
      }
    />
  );

  return (
    <FormControl>
      <FormLabel>
        {isUnitChanged ? " Wavelength range (nm)" : " Wavenumber range (cm⁻¹)"}
      </FormLabel>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={3} lg={4}>
          <Controller
            name="min_wavenumber_range"
            control={control}
            defaultValue={minRange}
            render={({ field: { onChange, value } }) =>
              rangeInput("min-wavenumber-input", onChange, value)
            }
          />
        </Grid>
        <Grid item xs={3} lg={4}>
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
        <Grid item xs={3} lg={4}>
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
    </FormControl>
  );
};
