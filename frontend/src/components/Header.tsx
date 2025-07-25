import {useState} from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import DashboardIcon from "@mui/icons-material/Dashboard";
import {NavLink} from "react-router-dom";
import UserAuthMenu from "./UserAuthMenu";
import {useAuth0} from "@auth0/auth0-react";

const pages = [
  {name: "Filament", link: "/filament"},
  //{ name: "Resin", link: "/resin" },
  {name: "Printers", link: "/dashboard/printers"},
  {name: "Prints", link: "/prints"},
  {name: "Inventory", link: "/inventory"},
  {name: "Docs", link: "/documentation"},
];

const Header = () => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const {isAuthenticated, isLoading} = useAuth0();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <DashboardIcon
              sx={{display: {xs: "none", md: "flex"}, mr: 1}}
            />
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                display: {xs: "none", md: "flex"},
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <NavLink
                to="/"
                style={{color: "inherit", textDecoration: "none"}}
              >
                3DP Dashboard
              </NavLink>
            </Typography>

            <Box sx={{flexGrow: 1, display: {xs: "flex", md: "none"}}}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon/>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: {xs: "block", md: "none"},
                }}
              >
                {!isLoading &&
                  isAuthenticated &&
                  pages.map((page) => (
                    <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">
                        <NavLink
                          to={page.link}
                          style={{color: "inherit", textDecoration: "none"}}
                        >
                          {page.name}
                        </NavLink>
                      </Typography>
                    </MenuItem>
                  ))}
              </Menu>
            </Box>
            <DashboardIcon
              sx={{display: {xs: "flex", md: "none"}, mr: 1}}
            />
            <Typography
              variant="h5"
              noWrap
              sx={{
                mr: 2,
                display: {xs: "flex", md: "none"},
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <NavLink
                to="/"
                style={{color: "inherit", textDecoration: "none"}}
              >
                3DP
              </NavLink>
            </Typography>
            <Box sx={{flexGrow: 1, display: {xs: "none", md: "flex"}}}>
              {!isLoading &&
                isAuthenticated &&
                pages.map((page) => (
                  <NavLink
                    key={page.name}
                    to={page.link}
                    style={{color: "inherit", textDecoration: "none"}}
                  >
                    <Button
                      onClick={handleCloseNavMenu}
                      sx={{my: 2, color: "white", display: "block"}}
                    >
                      {page.name}
                    </Button>
                  </NavLink>
                ))}
            </Box>
            <UserAuthMenu/>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Header;
