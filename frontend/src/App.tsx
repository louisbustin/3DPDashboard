import "./App.css";
import CssBaseline from "@mui/material/CssBaseline";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useDarkMode } from "usehooks-ts";
import { Container } from "@mui/material";
import { SWRConfig } from "swr";
import useBearerToken from "./hooks/use-bearer-token";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function App() {
  const { isDarkMode } = useDarkMode();
  const bearerToken = useBearerToken();

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
    },
  });

  const swrConfig = {
    refreshInterval: 300000,
    fetcher: async (resource: RequestInfo, init: RequestInit | undefined) => {
      return fetch(resource, {
        ...init,
        headers: {
          ...init?.headers,
          Authorization: `Bearer ${bearerToken}`,
        },
      })
        .then(async (res) => {
          if (res.status === 200) {
            return await res.json();
          } else {
            Promise.reject(res.statusText);
          }
        })
        .catch((err) => console.error("Error in fetcher:", err));
    },
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <SWRConfig value={swrConfig}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header />

            <Container>
              <Outlet />
              <div style={{ marginTop: 60 }}></div>
            </Container>

            <Footer />
          </ThemeProvider>
        </SWRConfig>
      </LocalizationProvider>
    </>
  );
}

export default App;
