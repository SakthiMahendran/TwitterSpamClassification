import React from "react";
import { Box } from "@mui/material";

const CenteredContainer = ({ children }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      padding="1rem"
    >
      <Box
        width="100%"
        maxWidth="400px"
        padding="2rem"
        boxShadow="0px 2px 10px rgba(0, 0, 0, 0.1)"
        borderRadius="8px"
        bgcolor="white"
      >
        {children}
      </Box>
    </Box>
  );
};

export default CenteredContainer;
