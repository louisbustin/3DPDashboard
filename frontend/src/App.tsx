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
      <SWRConfig value={swrConfig}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Header />

          <Container>
            <Outlet />
          </Container>

          <Footer />
        </ThemeProvider>
      </SWRConfig>
    </>
  );
}

export default App;
