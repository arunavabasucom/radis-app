import React from "react";
import Button from "@mui/material/Button";
import { Control, Controller } from "react-hook-form";
import { FormValues } from "../types";

type calSpecButtomProps = {
  control: Control<FormValues>;
};

export const CalcSpectrumButton: React.FC<calSpecButtomProps> = ({
  control,
}) => (
  <Controller
    //@ts-ignore
    name="calspectrum_button"
    defaultValue=""
    control={control}
    render={({ formState: { isDirty } }) => (
      <Button
        id="calc-spectrum-button"
        disabled={!isDirty}
        variant="contained"
        color="primary"
        type="submit"
      >
        Calculate spectrum
      </Button>
    )}
  />
);
