/* eslint-disable react/prop-types */
// TODO: Figure out the meaning of "'minRange' is missing in props validation"
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Input from "@material-ui/core/Input";

interface WavelengthRangeSliderProps {
  minRange: number;
  maxRange: number;
}

const useStyles = makeStyles({
  root: {
    width: 250,
  },
  input: {
    width: 52,
  },
});

const WavelengthRangeSlider: React.FunctionComponent<WavelengthRangeSliderProps> = ({
  minRange,
  maxRange,
}) => {
  const classes = useStyles();
  const [lowerRange, setLowerRange] = React.useState<number | "">(1900);
  const [upperRange, setUpperRange] = React.useState<number | "">(2300);

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
    setRange: (range: number | "") => void
  ) => (
    <Input
      className={classes.input}
      value={value}
      margin="dense"
      onChange={(event) => handleInputChange(event, setRange)}
      onBlur={handleBlur}
      inputProps={{
        step: 100,
        min: minRange,
        max: maxRange,
        type: "number",
        "aria-labelledby": "input-slider",
      }}
    />
  );

  return (
    <div className={classes.root}>
      <Typography id="input-slider" gutterBottom>
        Wavelength range (cm⁻¹)
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item>{rangeInput(lowerRange, setLowerRange)}</Grid>
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
        <Grid item>{rangeInput(upperRange, setUpperRange)}</Grid>
      </Grid>
    </div>
  );
};

export default WavelengthRangeSlider;
