import { IconButton, Typography } from "@mui/joy";
import { Popover } from "@mui/material";
import { useState } from "react";
import InfoIcon from "@mui/icons-material/Info";


export const InfoPopover = () => {
  const [anchorEl, setAnchorEl] = useState<
    (EventTarget & HTMLButtonElement) | null
  >(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <IconButton onClick={handleClick}>
        <InfoIcon style={{ color: "#0A6ACA", fontSize: "30" }} />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Typography style={{ width: 300, padding: 10 }}>
          Powered by{" "}
          <a href="https://radis.github.io/" rel="noreferrer">
            RADIS
          </a>
          , based on{" "}
          <a href="https://hitran.org/" rel="noreferrer">
            the HITRAN database
          </a>
          .<br />
          <br />
          For research-grade use, start{" "}
          <a href="https://radis.github.io/radis-lab/" rel="noreferrer">
            🌱 Radis-Lab
          </a>{" "}
          with preconfigured databases (HITRAN, HITEMP) and an online Python
          Jupyter environment (no install needed).
        </Typography>
      </Popover>
    </div>
  );
};
