import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const Preloader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        minWidth: "300px",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Preloader;
