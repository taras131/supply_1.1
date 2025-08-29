import React from 'react';
import {Stack, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import MyButton from "../../../styles/theme/customizations/MyButton";

const InvoiceDetailsPageHeader = () => {
    const navigate = useNavigate();
    const handleBackClick = () => {
        navigate(-1);
    };
    return (
        <Stack direction="row"
               spacing={3}
               justifyContent="space-between"
               alignItems="center"
               sx={{mb: 2, mt: 2}}>
            <Typography component="h2" variant="h6">
                Счёт
            </Typography>
            <MyButton onClick={handleBackClick} variant={"outlined"}>
                Назад
            </MyButton>
        </Stack>
    );
};

export default InvoiceDetailsPageHeader;