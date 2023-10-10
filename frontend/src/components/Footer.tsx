import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import Paper from "@mui/material/Paper";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const [activeTabNumber, setActiveTabNumber] = useState(0);
  const navigate = useNavigate();

  return (
    <>
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={activeTabNumber}
          onChange={(event, newValue) => {
            setActiveTabNumber(newValue);
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
