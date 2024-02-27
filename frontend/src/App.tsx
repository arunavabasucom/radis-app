/* eslint-disable import/no-unresolved */
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
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import "fontsource-roboto";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import CssBaseline from "@mui/material/CssBaseline";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { PlotSpectra } from "./components/PlotSpectra";
import { palette } from "./constants";
import logo from "./radis.png";

const ColorModeContext = React.createContext({
  toggleColorMode: () => {
    console.warn("toggleColorMode has no implementation");
  },
});

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
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
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
          <IconButton
            sx={{ ml: 1 }}
            onClick={colorMode.toggleColorMode}
            color="inherit"
          >
            {theme.palette.mode === "dark" ? (
              <Brightness7Icon />
            ) : (
              <Brightness4Icon />
            )}
          </IconButton>
          <InfoPopover />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

function App(): React.ReactElement {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <div className={classes.root}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
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

export default function ToggleColorMode() {
  const [mode, setMode] = React.useState<"light" | "dark">("light");
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        {/*for analytics*/}
        <Analytics />
        {/*for speed insights*/}
        <SpeedInsights />
        <App />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
