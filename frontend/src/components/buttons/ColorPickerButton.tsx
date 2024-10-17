import { Button, Popover, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { SketchPicker } from "react-color";
import React from "react";

const ColorPickerButton = (
  props: React.PropsWithoutRef<{
    color?: string;
    onChangeComplete?: (color: string) => void;
  }>
) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [currentColor, setCurrentColor] = useState(props.color || "#FFFFFF");

  useEffect(() => {
    setCurrentColor(props.color || "#ffffff");
  }, [props.color]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <Button
        aria-describedby={id}
        variant="contained"
        onClick={handleClick}
        sx={{
          backgroundColor: currentColor,
          color: theme.palette.getContrastText(currentColor),
        }}
      >
        {currentColor}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <SketchPicker
          color={currentColor}
          onChange={(color) => setCurrentColor(color.hex)}
          onChangeComplete={(color) => {
            setCurrentColor(color.hex);
            if (props.onChangeComplete) {
              props.onChangeComplete(color.hex);
            }
          }}
        ></SketchPicker>
      </Popover>
    </>
  );
};

export default ColorPickerButton;
