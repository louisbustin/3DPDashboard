import { useDarkMode } from "usehooks-ts";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

const DarkModeButton = () => {
  const { isDarkMode, enable, disable } = useDarkMode();

  return (
    <>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={isDarkMode}
              onChange={(
                event: React.ChangeEvent<HTMLInputElement>,
                checked: boolean
              ) => {
                checked ? enable() : disable();
              }}
            />
          }
          label="Dark Mode"
        />
      </FormGroup>
    </>
  );
};

export default DarkModeButton;
