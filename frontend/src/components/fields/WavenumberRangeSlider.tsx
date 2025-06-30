import React from "react";
import Slider from "@mui/joy/Slider";
import Input from "@mui/joy/Input";
import { Controller, useFormContext } from "react-hook-form";
import Grid from "@mui/joy/Grid";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import { FormValues } from "../types";
import useFromStore from "../../store/form";
import { WaveLengthUnit } from "./WaveLengthUnits";

export const WavenumberRangeSlider: React.FC = () => {
  const { control, setValue } = useFormContext();
  const { simulateSlitUnit: isUnitChanged, formMode } = useFromStore();
  const minRange = isUnitChanged ? 300 : 1000;
  const maxRange = isUnitChanged ? 10000 : 20000;

  const [lowerRange, setLowerRange] = React.useState<number>(1900);
  const [upperRange, setUpperRange] = React.useState<number>(2300);

  React.useEffect(() => {
    if (formMode === "calc") {
      setValue("min_wavenumber_range", lowerRange ?? minRange);
      setValue("max_wavenumber_range", upperRange ?? maxRange);
    } else {
      setValue("experimental_conditions.min_wavenumber_range", lowerRange ?? minRange);
      setValue("experimental_conditions.max_wavenumber_range", upperRange ?? maxRange);
    }
  }, [lowerRange, upperRange, setValue, minRange, maxRange, formMode]);
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
      onBlur={handleBlur}
      endDecorator={
        <React.Fragment>
          <Divider orientation="vertical" />
          <WaveLengthUnit />
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
        <Grid xs={12} sm={8} md={5} lg={4}>
          <Controller
            name={formMode === "calc" ? "min_wavenumber_range" : "experimental_conditions.min_wavenumber_range"}
            control={control}
            defaultValue={minRange}
            render={({ field: { onChange, value } }) =>
              rangeInput("min-wavenumber-input", onChange, value)
            }
          />
        </Grid>
        <Grid xs={12} sm={8} md={5} lg={4}>
          <Slider
            value={[
              lowerRange === 0 ? minRange : lowerRange,
              upperRange === 0 ? maxRange : upperRange,
            ]}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            min={minRange}
            max={maxRange}
          />
        </Grid>
        <Grid xs={12} sm={8} md={5} lg={4}>
          <Controller
            name={formMode === "calc" ? "max_wavenumber_range" : "experimental_conditions.max_wavenumber_range"}
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
