import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Input from "@material-ui/core/Input";
import { CalcSpectrumParams } from "../../constants";

interface WavelengthRangeSliderProps {
  minRange: number;
  maxRange: number;
  params: CalcSpectrumParams;
  setParams: (params: CalcSpectrumParams) => void;
}

const useStyles = makeStyles({
  input: {
    width: 52,
  },
});

export const WavenumberRangeSlider: React.FC<WavelengthRangeSliderProps> = ({
  minRange,
  maxRange,
  params,
  setParams,
}) => {
  const classes = useStyles();
  const [lowerRange, setLowerRange] = useState<number | "">(1900);
  const [upperRange, setUpperRange] = useState<number | "">(2300);

  // TOOD: Would be better to just store as a number everywhere instead of
  // checking if it's an empty string
  useEffect(() => {
    setParams({
      ...params,
      min_wavenumber_range: lowerRange === "" ? minRange : lowerRange,
      max_wavenumber_range: upperRange === "" ? maxRange : upperRange,
    });
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

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setRange: (range: number | "") => void
  ) => {
    setRange(event.target.value === "" ? "" : Number(event.target.value));
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
    value: number | "",
    setRange: (range: number | "") => void,
    id: string
  ) => (
    <Input
      fullWidth
      id={id}
      className={classes.input}
      value={value}
      margin="dense"
      onChange={(event) => handleInputChange(event, setRange)}
      onBlur={handleBlur}
      inputProps={{
        min: minRange,
        max: maxRange,
        type: "number",
        "aria-labelledby": "input-slider",
        step: "any",
      }}
    />
  );

  return (
    <div>
      <Typography id="input-slider" gutterBottom>
        Wavenumber range (cm⁻¹)
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item sm={12} lg={2}>
          {rangeInput(lowerRange, setLowerRange, "min-wavenumber-input")}
        </Grid>
        <Grid item xs={12} sm={12} lg={5}>
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
        <Grid item sm={12} lg={2}>
          {rangeInput(upperRange, setUpperRange, "max-wavenumber-input")}
        </Grid>
      </Grid>
    </div>
  );
};
