import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import "@fontsource/roboto"; // MUI default font

// Create a custom theme
const theme = createTheme({
  palette: {
    mode: "light", // Change to "dark" for dark mode
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    error: {
      main: "#d32f2f",
    },
    background: {
      default: "#f5f5f5",
      paper: "#fff",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
