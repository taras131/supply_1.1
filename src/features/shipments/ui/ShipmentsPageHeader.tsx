import React from 'react';
import {Stack} from "@mui/material";
import MyButton from "../../../styles/theme/customizations/MyButton";
import AddIcon from "@mui/icons-material/Add";
import {useNavigate} from "react-router-dom";
import {routes} from "../../../utils/routes";
import PageHeaderTemplate from "../../../components/templates/PageHeaderTemplate";

const ShipmentsPageHeader = () => {
    const navigate = useNavigate();
    const addClickHandler = () => {
        navigate(routes.shipmentsAddNew)
    }
    return (
        <PageHeaderTemplate title={"Отгрузки"}>
            <Stack direction="row" spacing={1}>
                <MyButton
                    startIcon={<AddIcon sx={{fontSize: "var(--icon-fontSize-md)"}}/>}
                    variant="contained"
                    onClick={addClickHandler}
                >
                    Добавить
                </MyButton>
            </Stack>
        </PageHeaderTemplate>
    );
};

export default ShipmentsPageHeader;