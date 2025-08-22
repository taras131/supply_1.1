import React from 'react';
import {Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useNavigate} from "react-router-dom";
import {routes} from "../../../utils/routes";
import AddIcon from "@mui/icons-material/Add";
import MyButton from "../../../styles/theme/customizations/MyButton";

const OrdersPageHeader = () => {
    const navigate = useNavigate();
    const addClickHandler = () => {
        navigate(routes.ordersAddNew)
    }
    return (
        <Stack direction="row"
               spacing={3}
               justifyContent="space-between"
               alignItems="center"
               sx={{mb: 2, mt: 2}}>
            <Typography component="h2" variant="h6">
                Заявки
            </Typography>
            <div>
                <MyButton
                    startIcon={<AddIcon sx={{fontSize: "var(--icon-fontSize-md)"}}/>}
                    variant="contained"
                    onClick={addClickHandler}
                >
                    Добавить
                </MyButton>
            </div>
        </Stack>
    );
};

export default OrdersPageHeader;