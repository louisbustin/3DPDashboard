import { Box, Container, Stack, Typography } from "@mui/material";
import printer from "../images/3dprinter1.webp";
import SiteStatus from "./SiteStatus";

const HomePageNoAuth = () => {
  return (
    <>
      <Container maxWidth="xl">
        <Box display="flex" flexDirection="column" justifyContent="center">
          <h3>Welcome to 3DPDashboard!</h3>
          <Stack direction={{ xs: "column", sm: "row" }}>
            <Stack direction="column">
              <Typography>
                This site is a means to organize all of your consumables used in
                3d Printing. This first iteration will be focused on FDM
                printers and their filament.
              </Typography>
              <Typography>
                Click the "Log In" button in the top nav to get started. Create
                an account on the login screen and then get to work adding your
                printers and filaments.
              </Typography>
              <h2>Dev Status</h2>
              <SiteStatus />
            </Stack>
            <img
              src={printer}
              width={200}
              height={200}
              style={{ marginLeft: 5, paddingRight: 5 }}
              alt="3D Printer"
            />
          </Stack>
        </Box>
      </Container>
    </>
  );
};

export default HomePageNoAuth;
