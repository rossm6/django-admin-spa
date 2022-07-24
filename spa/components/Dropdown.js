import { Box } from "theme-ui";
import React from "react";

export function Dropdown({ children, buttonHeight, maxWidth, position, show, width }) {
  if (!show) return null;

  let translationX = '0px';
  if(position){
    if(position === "left"){
      translationX = "-100%";
    }
    else if(position === "right"){
      translationX = "0px";
    }
  }

  return (
    <Box
      sx={{
        position: "absolute",
        inset: "0px auto auto 0px",
        m: 0,
        transform: `translate(${translationX}, ${buttonHeight}px)`,
        zIndex: 10000,
        width,
        maxWidth,
      }}
    >
      {children}
    </Box>
  );
}

Dropdown.defaultProps = {
  buttonHeight: 40,
};

export function DropdownMenu({ children, show, showProp }) {
  const sx = {
    position: "relative",
  };

  sx[showProp] = show
    ? showProp === "display"
      ? "block"
      : "visible"
    : showProp === "display"
    ? "none"
    : "hidden";

  return <Box sx={sx}>{children}</Box>;
}

DropdownMenu.defaultProps = {
  show: true,
  showProp: "display",
};
