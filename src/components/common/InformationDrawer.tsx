import React, { FC } from "react";
import { Typography, Box } from "@mui/material";

export interface IInformationItem {
  label: string; // Название пункта (например, "Дата создания")
  value: string | number; // Значение пункта (например, "2023-01-01")
}

interface IProps {
  items: IInformationItem[]; // Список для отображения
}

const InformationDrawer: FC<IProps> = ({ items }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {items.map((item, index) => (
        <Box
          key={index} // Уникальный ключ для каждого элемента
          sx={{
            display: "flex",
            flexDirection: "column",
            borderRadius: "4px",
            padding: "8px 16px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ color: "text.secondary", marginBottom: "4px" }} // Стилизация лейбла
          >
            {item.label}:
          </Typography>
          <Typography variant="body1" sx={{ color: "text.primary" }}>
            {" "}
            {/* Основное значение */}
            {item.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default InformationDrawer;
