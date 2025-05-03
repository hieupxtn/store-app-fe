import React from "react";

interface ImageProps {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  onClick?: () => void;
}

const Image: React.FC<ImageProps> = ({
  src,
  alt = "",
  width,
  height,
  className = "",
  onClick,
}) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onClick={onClick}
      style={{
        maxWidth: "100%",
        height: "auto",
      }}
    />
  );
};

export default Image;
