import React from 'react';
import {Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {Link} from "react-router-dom";
import {routes} from "../../../utils/routes";
import AddIcon from "@mui/icons-material/Add";

const OrdersPageHeader = () => {
    return (
        <Stack direction="row" spacing={3} justifyContent="space-between" alignItems="center" sx={{mb: 2, mt: 2}}>
            <Typography component="h2" variant="h6">
                Заявки
            </Typography>
            <div>
                <Button
                    component={Link}
                    to={routes.ordersAddNew}
                    startIcon={<AddIcon sx={{fontSize: "var(--icon-fontSize-md)"}}/>}
                    variant="contained"
                >
                    Добавить
                </Button>
            </div>
        </Stack>
    );
};

export default OrdersPageHeader;