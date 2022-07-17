import React from "react";
import Button from "@material-ui/core/Button";

type calSpecButtomProps = {
  calcSpectrumButtonDisabled: boolean;
};

export const CalcSpectrumButton: React.FC<calSpecButtomProps> = ({
  calcSpectrumButtonDisabled,
}) => (
  <Button
    id="calc-spectrum-button"
    disabled={calcSpectrumButtonDisabled}
    variant="contained"
    color="primary"
    type="submit"
  >
    Calculate spectrum
  </Button>
);
