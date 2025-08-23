import React from "react";
import {
  Box,
  IconButton,
  Typography,
  Sheet,
  Container,
  Button
} from "@mui/joy";
import GitHubIcon from "@mui/icons-material/GitHub";
import { InfoPopover } from "./InfoPopover";
import { Settings } from "./Settings";
import logo from "../radis.png";
import { useColorScheme } from '@mui/joy/styles';
import LightModeIcon from "@mui/icons-material/LightMode"; // Sun
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { Link, useLocation } from "react-router-dom";

export const Header: React.FC = () => {
  const { mode, setMode } = useColorScheme();
  const location = useLocation();

  return (
    <Sheet
      variant="plain"
      sx={{
        borderBottom: "1px solid #ccc",
        backgroundColor: mode === "dark" ? "#272727" : "white",
      }}
    >
      <Container maxWidth="xl" sx={{ py: { xs: 0.5, sm: 1 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: { xs: 1, sm: 0 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              justifyContent: { xs: "center", sm: "flex-start" },
              mb: { xs: 1, sm: 0 },
            }}
          >
            <img src={logo} height={40} style={{ maxWidth: 40 }} alt="Radish logo" />
            <Typography
              level="h4"
              sx={{
                fontWeight: 1000,
                color: mode === "dark" ? "white" : "black",
                fontSize: { xs: 22, sm: 28 },
              }}
            >
              Radis App
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 2 },
              flexDirection: { xs: "column", sm: "row" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: { xs: 1, sm: 1 },
                flexDirection: { xs: "column", sm: "row" },
                width: { xs: "100%", sm: "auto" },
              }}
            >
              <Button
                component={Link}
                to="/"
                variant={location.pathname === "/" ? "solid" : "outlined"}
                size="sm"
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                Spectrum Calculation
              </Button>
              <Button
                component={Link}
                to="/fit-spectra"
                variant={location.pathname === "/fit-spectra" ? "solid" : "outlined"}
                size="sm"
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                Spectrum Fitting
              </Button>
            </Box>

            <Box sx={{ display: "flex", gap: 1, mt: { xs: 1, sm: 0 }, justifyContent: { xs: "center", sm: "flex-start" } }}>
              <IconButton
                variant="plain"
                aria-label="GitHub"
                onClick={() =>
                  (window.location.href = "https://github.com/suzil/radis-app")
                }
              >
                <GitHubIcon sx={{ color: mode === "dark" ? "white" : "", fontSize: 28 }} />
              </IconButton>
              <IconButton
                aria-label="Theme"
                onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
              >
                {mode === "dark" ? (
                  <DarkModeIcon />
                ) : (
                  <LightModeIcon />
                )}
              </IconButton>
              <Settings />
              <InfoPopover />
            </Box>
          </Box>
        </Box>
      </Container>
    </Sheet >
  );
};
