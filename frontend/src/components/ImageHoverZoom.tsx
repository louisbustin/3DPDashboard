import { PropsWithoutRef, useState } from "react";
import "./ImageHoverZoom.css";
import { Backdrop } from "@mui/material";

const ImageHoverZoom = (
  props: PropsWithoutRef<{
    imagePath: string;
    alt?: string;
    width?: number;
    height?: number;
  }>
) => {
  const [openZoom, setOpenZoom] = useState(false);
  return (
    <div className="img-wrapper">
      <img
        src={props.imagePath}
        alt={props.alt}
        className="hover-zoom"
        width={props.width}
        height={props.height}
        onClick={() => setOpenZoom((curr) => !curr)}
      />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openZoom}
        onClick={() => setOpenZoom(false)}
      >
        <img src={props.imagePath} alt={props.alt} />
      </Backdrop>
    </div>
  );
};
export default ImageHoverZoom;
