import React from "react";
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Popover,
  Toolbar,
  Typography,
} from "@material-ui/core";
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import InfoIcon from "@material-ui/icons/Info";
import "fontsource-roboto";
import { CalcSpectrum } from "./components/CalcSpectrum";
import { palette } from "./constants";
import logo from "./radis.png";

const theme = createMuiTheme({
  palette,
});

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}));

const InfoPopover = () => {
  const [anchorEl, setAnchorEl] =
    React.useState<(EventTarget & HTMLButtonElement) | null>(null);

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
        <InfoIcon style={{ color: "white" }} />
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
          <a href="https://https://hitran.org/" rel="noreferrer">
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
          <Box m={4}>
            <CalcSpectrum />
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
