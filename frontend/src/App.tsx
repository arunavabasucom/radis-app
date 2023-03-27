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
import ToggleButton from "@mui/material/ToggleButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness6Icon from "@mui/icons-material/Brightness6";
import "fontsource-roboto";
import ReactGA from "react-ga4";
import { PlotSpectra } from "./components/PlotSpectra";
// import { palette } from "./constants";
import logo from "./radis.png";

/*#########INITIALIZING_GOOGLE_ANALYTICS###############*/
ReactGA.initialize("G-V67HS7VB4R");
ReactGA.send(window.location.pathname);
/*#########INITIALIZING_GOOGLE_ANALYTICS###############*/

const lightTheme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
    background: {
      default: "#f2f2f2",
    },
  },
});

const darkTheme = createTheme({
  palette: {
    primary: {
      main: "#083c57",
    },
    background: {
      default: "#121212",
    },
    text: {
      primary: "#000",
    },
  },
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

function Header({ toggleTheme }: { toggleTheme: () => void }) {
  const classes = useStyles();

  const [themeMode] = useState<"light" | "dark">("light");

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
        <IconButton
          size="large"
          edge="end"
          color="inherit"
          aria-label="github"
          href="https://github.com/radis/radis"
          target="_blank"
        >
          <GitHubIcon />
        </IconButton>
        &nbsp;&nbsp;
        <ToggleButton
          size="small"
          value="check"
          selected={themeMode === "dark"}
          onChange={toggleTheme}
          aria-label="Dark mode toggle"
          
        >
          {themeMode === "dark" ? <Brightness6Icon color="warning"/> : <Brightness4Icon color="warning"/>}
        </ToggleButton>
        <InfoPopover />
      </Toolbar>
      </Container>
    </AppBar>
  );
}

function App(): React.ReactElement {
  const classes = useStyles();
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const theme = themeMode === "light" ? lightTheme : darkTheme;

  return (
    <div className={classes.root}>
      <ThemeProvider theme={theme}>
        <Header toggleTheme={toggleTheme} />
        <Container maxWidth="lg">
          <Box sx={{ m: 6 }}>
            <PlotSpectra/>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App; //export
