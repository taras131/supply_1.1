import React from 'react';
import {Stack} from "@mui/material";
import MyButton from "../../../styles/theme/customizations/MyButton";
import AddIcon from "@mui/icons-material/Add";
import {useNavigate} from "react-router-dom";
import {routes} from "../../../utils/routes";
import UploadPayments from "./UploadPayments";
import PageHeaderTemplate from "../../../components/templates/PageHeaderTemplate";

const InvoicesPageHeader = () => {
    const navigate = useNavigate();
    const addClickHandler = () => {
        navigate(routes.invoicesAddNew)
    }
    return (
        <PageHeaderTemplate title={"Счета"}>
            <Stack direction="row" spacing={1}>
                <UploadPayments/>
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

export default InvoicesPageHeader;