import React from "react";
import Button from "@mui/joy/Button";

interface DownloadSpecButtonProps {
  disabled: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export const DownloadSpecButton: React.FC<DownloadSpecButtonProps> = ({
  disabled = false,
  onClick,
}) => (
  <Button
    fullWidth
    id="download-button"
    disabled={disabled}
    variant="outlined"
    onClick={onClick}
  >
    Download SPEC
  </Button>
);
