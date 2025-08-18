import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";

export const AnimatedCard = styled(Card)<{ expanded?: boolean }>(({ expanded }) => ({
  minWidth: 225,
  transition: "transform 0.3s ease, opacity 0.3s ease",
  cursor: "pointer",
  position: expanded ? "fixed" : "relative",
  top: expanded ? "50%" : "auto",
  left: expanded ? "50%" : "auto",
  transform: expanded
    ? "translate(-50%, -50%) scale(1.05)" // Развёрнутая: центр и увеличение
    : "translate(0, 0) scale(1)", // Свернутая: стартовая позиция
  zIndex: expanded ? 1000 : 1,
  width: expanded ? "80vw" : "auto",
  maxWidth: expanded ? "1200px" : "none",
  maxHeight: expanded ? "90vh" : "auto",
  opacity: 1,
  ...(!expanded && {
    "&:hover": {
      transform: "translate(0, -6px)", // Ховер: масштаб через тот же origin
    },
  }),
}));
