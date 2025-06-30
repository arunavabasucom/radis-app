import React from "react";
import Slider from "@mui/joy/Slider";
import Input from "@mui/joy/Input";
import { Controller, useFormContext } from "react-hook-form";
import Grid from "@mui/joy/Grid";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import { FitFormValues } from "../types";
import useFitFormStore from "../../store/fitForm";

type FitParameter = keyof FitFormValues["bounding_ranges"];

function capitalizeFirstLetter(text: string): string {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export const BoundingRanges: React.FC<{ fitParameter: FitParameter }> = ({ fitParameter }) => {
  const { control, setValue } = useFormContext();
  const { setTgasBoundingRange, setTvibBoundingRange, setTrotBoundingRange, setMoleFractionBoundingRange, setPressureBoundingRange } = useFitFormStore();
  const minRange = 0;
  const maxRange = 10000;

  const [lowerRange, setLowerRange] = React.useState<number>(1900);
  const [upperRange, setUpperRange] = React.useState<number>(2300);

  const getSetterFunction = (param: FitParameter) => {
    switch (param) {
      case 'tgas':
        return setTgasBoundingRange;
      case 'tvib':
        return setTvibBoundingRange;
      case 'trot':
        return setTrotBoundingRange;
      case 'mole_fraction':
        return setMoleFractionBoundingRange;
      case 'pressure':
        return setPressureBoundingRange;
      default:
        return () => { };
    }
  };

  React.useEffect(() => {
    const setFormValue = getSetterFunction(fitParameter);

    setValue(`bounding_ranges.${fitParameter}.min`, lowerRange ?? minRange);
    setValue(`bounding_ranges.${fitParameter}.max`, upperRange ?? maxRange);
    console.log(`bounding_ranges.${fitParameter}.min`, lowerRange ?? minRange);
    // Update the Zustand store
    setFormValue({ min: lowerRange ?? minRange, max: upperRange ?? maxRange });
  }, [lowerRange, upperRange, setValue, minRange, maxRange, fitParameter]);

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
      | number
  ) => (
    <Input
      id={id}
      value={value}
      onChange={(e) =>
        onChange(e.target.value === "" ? "" : Number(e.target.value))
      }
      onBlur={handleBlur}
    // endDecorator={
    //   <React.Fragment>
    //     <Divider orientation="vertical" />
    //     <WaveLengthUnit />
    //   </React.Fragment>
    // }
    />
  );

  return (
    <FormControl>
      <FormLabel>
        {capitalizeFirstLetter(fitParameter)} Bounding Range
      </FormLabel>
      <Grid container spacing={2} alignItems="center">
        <Grid xs={12} lg={4}>
          <Controller
            name={`bounding_ranges.${fitParameter}.min`}
            control={control}
            defaultValue={minRange}
            render={({ field: { onChange, value } }) =>
              rangeInput(`min-${fitParameter}Bounding-input`, onChange, value)
            }
          />
        </Grid>
        <Grid xs={12} lg={4}>
          <Slider
            value={[
              lowerRange === 0 ? minRange : lowerRange,
              upperRange === 0 ? maxRange : upperRange,
            ]}
            onChange={handleSliderChange}
            aria-labelledby={`input-${fitParameter}-slider`}
            min={minRange}
            max={maxRange}
          />
        </Grid>
        <Grid xs={12} lg={4}>
          <Controller
            name={`bounding_ranges.${fitParameter}.max`}
            control={control}
            defaultValue={maxRange}
            render={({ field: { onChange, value } }) =>
              rangeInput(`max-${fitParameter}Bounding-input`, onChange, value)
            }
          />
        </Grid>
      </Grid>
    </FormControl>
  );
};
