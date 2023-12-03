import { PropsWithoutRef } from "react";
import "./ImageWithText.css";

const ImageWithText = (
  props: PropsWithoutRef<{
    src: string;
    text: string;
    width?: number;
    height?: number;
  }>
) => {
  return (
    <article className="article">
      <img
        className="image"
        src={props.src}
        alt="background"
        width={props.width}
        height={props.height}
      />
      <h1 className="header">{props.text}</h1>
    </article>
  );
};

export default ImageWithText;
