import React, { FC } from "react";
import Card from "@mui/material/Card";
import { Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";

export const STYLES = {
  stack: (isEditMode: boolean) => ({
    width: "100%",
    display: "grid",
    gridTemplateColumns: `repeat(auto-fit, minmax(${isEditMode ? 240 : 200}px, 1fr))`,
    gap: isEditMode ? "14px" : "34px",
    justifyItems: "center",
    "& > *": {
      minWidth: isEditMode ? "280px" : "180px",
      width: "100%",
      maxWidth: "420px",
    },
  }),
};

interface IProps {
  children: React.ReactNode;
  isEditMode?: boolean;
  title?: string;
  footer?: string;
}

const ViewCardPattern: FC<IProps> = ({ title, footer, children, isEditMode = true }) => {
  return (
    <Card
      sx={{
        position: "relative",
        padding: "24px",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {title && (
        <Typography sx={{ marginBottom: "36px" }} variant="h5" color="primary">
          {title}
        </Typography>
      )}
      <Stack spacing={2} sx={{ ...STYLES.stack(isEditMode), flexGrow: 1 }}>
        {children}
      </Stack>
      {footer && (
        <Box mt="auto" width="100%">
          <Typography variant={"subtitle2"} textAlign={"center"}>
            {footer}
          </Typography>
        </Box>
      )}
    </Card>
  );
};

export default ViewCardPattern;
