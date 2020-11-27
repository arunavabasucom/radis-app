/* eslint-disable react/prop-types */
// TODO: Figure out the meaning of "'minRange' is missing in props validation"
import React from "react";

interface WavelengthRangeSliderProps {
  minRange: number;
  maxRange: number;
}

const WavelengthRangeSlider: React.FunctionComponent<WavelengthRangeSliderProps> = ({
  minRange,
  maxRange,
}) => {
  return <p>{`Wavelength range here! ${minRange} - ${maxRange}`}</p>;
};

export default WavelengthRangeSlider;
