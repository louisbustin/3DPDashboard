import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import Paper from "@mui/material/Paper";
import { useLocation, useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const loc = useLocation();

  let activeTab = -1;
  switch (loc.pathname) {
    case "/":
      activeTab = 0;
      break;
    case "/contact":
      activeTab = 1;
      break;
    case "/terms":
      activeTab = 2;
      break;
    case "/privacy":
      activeTab = 3;
      break;
  }

  return (
    <>
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={activeTab}
          onChange={(event, newValue) => {
            switch (newValue) {
              case 0:
                navigate("/");
                break;
              case 1:
                navigate("/contact");
                break;
              case 2:
                navigate("/terms");
                break;
              case 3:
                navigate("/privacy");
                break;
              default:
                break;
            }
            if (newValue === 1) {
            }
          }}
        >
          <BottomNavigationAction label="Home" icon={<HomeIcon />} />
          <BottomNavigationAction label="Contact" icon={<ContactPageIcon />} />
          <BottomNavigationAction label="Terms" icon={<StickyNote2Icon />} />
          <BottomNavigationAction label="Privacy" icon={<PrivacyTipIcon />} />
        </BottomNavigation>
      </Paper>
    </>
  );
};

export default Footer;
