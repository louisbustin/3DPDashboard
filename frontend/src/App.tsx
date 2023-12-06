import "./App.css";
import CssBaseline from "@mui/material/CssBaseline";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useDarkMode } from "usehooks-ts";
import { Container } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function App() {
  const { isDarkMode } = useDarkMode();
  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
    },
  });

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Header />

          <Container>
            <Outlet />
            <div style={{ marginTop: 60 }}></div>
          </Container>

          <Footer />
        </ThemeProvider>
      </LocalizationProvider>
    </>
  );
}

export default App;
