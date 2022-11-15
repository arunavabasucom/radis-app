import React, { useState } from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InfoIcon from "@mui/icons-material/Info";
import GitHubIcon from "@mui/icons-material/GitHub";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import "fontsource-roboto";
import ReactGA from "react-ga4";
import { PlotSpectra } from "./components/PlotSpectra";
import { palette } from "./constants";
import logo from "./radis.png";

/*#########INITIALIZING_GOOGLE_ANALYTICS###############*/
ReactGA.initialize("G-V67HS7VB4R");
ReactGA.send(window.location.pathname);
/*#########INITIALIZING_GOOGLE_ANALYTICS###############*/

export const theme = createTheme({
  palette,
});

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
});

const InfoPopover = () => {
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
        <InfoIcon style={{ color: "white", fontSize: "30" }} />
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

const Header: React.FC = () => {
  const classes = useStyles();
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar>
          <Box m={1}>
            <img src={logo} height={50} alt="Radish logo" />
          </Box>
          <Typography variant="h6" className={classes.title}>
            RADIS app
          </Typography>
          <IconButton>
            <GitHubIcon
              style={{ color: "white", fontSize: "28" }}
              onClick={() =>
                (window.location.href = "https://github.com/suzil/radis-app")
              }
            />
          </IconButton>
          <InfoPopover />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

function App(): React.ReactElement {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <ThemeProvider theme={theme}>
        <Header />
        <Container maxWidth="lg">
          <Box sx={{ m: 6 }}>
            <PlotSpectra />
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App; //export
