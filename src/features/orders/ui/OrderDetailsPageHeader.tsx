import React from 'react';
import Typography from "@mui/material/Typography";
import {Stack} from "@mui/material";
import {useNavigate} from "react-router-dom";
import MyButton from "../../../styles/theme/customizations/MyButton";

const OrderDetailsPageHeader = () => {
    const navigate = useNavigate();
    const backClickHandler = () => {
        navigate(-1);
    }
    return (
        <Stack direction="row" spacing={3} justifyContent="space-between" alignItems="center" sx={{mb: 2, mt: 2}}>
            <MyButton onClick={backClickHandler} variant={"outlined"}>
                Назад
            </MyButton>
            <Typography component="h2" variant="h6">
                Заявка
            </Typography>
        </Stack>
    );
};

export default OrderDetailsPageHeader;