import React, {FC} from 'react';
import Box from "@mui/material/Box";

interface IProps {
    isEditMode?: boolean;
    children: React.ReactNode;
}

const DetailsGrid: FC<IProps> = ({isEditMode = false, children}) => {
    return (
        <Box sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: `repeat(auto-fit, minmax(${isEditMode ? 240 : 200}px, 1fr))`,
            gap: isEditMode ? "14px" : "34px",
            "& > *": {
                minWidth: isEditMode ? "280px" : "180px",
                width: "100%",
                maxWidth: "420px",
            },
        }}>
            {children}
        </Box>
    );
};

export default DetailsGrid;