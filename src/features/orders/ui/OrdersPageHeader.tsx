import React from 'react';
import {useNavigate} from "react-router-dom";
import {routes} from "../../../utils/routes";
import AddIcon from "@mui/icons-material/Add";
import MyButton from "../../../styles/theme/customizations/MyButton";
import PageHeaderTemplate from "../../../components/templates/PageHeaderTemplate";

const OrdersPageHeader = () => {
    const navigate = useNavigate();
    const addClickHandler = () => {
        navigate(routes.ordersAddNew)
    }
    return (
        <PageHeaderTemplate title={"Заявки"}>
            <MyButton
                startIcon={<AddIcon sx={{fontSize: "var(--icon-fontSize-md)"}}/>}
                variant="contained"
                onClick={addClickHandler}
            >
                Добавить
            </MyButton>
        </PageHeaderTemplate>
    );
};

export default OrdersPageHeader;