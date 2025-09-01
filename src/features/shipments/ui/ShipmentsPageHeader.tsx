import React from 'react';
import {Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import MyButton from "../../../styles/theme/customizations/MyButton";
import AddIcon from "@mui/icons-material/Add";
import {useNavigate} from "react-router-dom";
import {routes} from "../../../utils/routes";

const ShipmentsPageHeader = () => {
    const navigate = useNavigate();
    const addClickHandler = () => {
        navigate(routes.shipmentsAddNew)
    }
    return (
        <Stack direction="row"
               spacing={3}
               justifyContent="space-between"
               alignItems="center"
               sx={{mb: 2, mt: 2}}>
            <Typography component="h2" variant="h6">
                Отгрузки
            </Typography>
            <Stack direction="row" spacing={1}>
                <MyButton
                    startIcon={<AddIcon sx={{fontSize: "var(--icon-fontSize-md)"}}/>}
                    variant="contained"
                    onClick={addClickHandler}
                >
                    Добавить
                </MyButton>
            </Stack>
        </Stack>
    );
};

export default ShipmentsPageHeader;