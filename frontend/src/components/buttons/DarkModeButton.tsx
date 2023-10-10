import { useDarkMode } from "usehooks-ts";
import Switch from "@mui/material/Switch";

const DarkModeButton = () => {
  const { isDarkMode, enable, disable } = useDarkMode();

  return (
    <>
      <Switch
        checked={isDarkMode}
        onChange={(
          event: React.ChangeEvent<HTMLInputElement>,
          checked: boolean
        ) => {
          checked ? enable() : disable();
        }}
      />
      Dark Mode
    </>
  );
};

export default DarkModeButton;
