import React from "react";
import { Box, Flex } from "theme-ui";

function Container ({children, maxWidth}){

  return (
    <Flex sx={{ justifyContent: "center" }}>
      <Box sx={{ width: "100%", maxWidth }}>{children}</Box>
    </Flex>
  );

}

export default Container;
