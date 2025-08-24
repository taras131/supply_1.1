import React, {FC} from 'react';
import {Stack} from "@mui/material";
import TitleWithValue from "../../../components/TitleWithValue";
import {IOrder, shipmentTypes} from "../../../models/iOrders";
import Box from "@mui/material/Box";

interface IProps {
    order: IOrder;
}

const OrderDetailsShow: FC<IProps> = ({order}) => {
    return (
        <Box sx={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px"}}>
            <TitleWithValue title={"Срочность:"}>
                {order.shipments_type}
            </TitleWithValue>
            <TitleWithValue title={"Тип заявки:"}>
                {order.type}
            </TitleWithValue>
            <TitleWithValue title={"Категория:"}>
                {order.category}
            </TitleWithValue>
            <TitleWithValue title={"Техника:"}>
                {order.machinery_id}
            </TitleWithValue>
        </Box>
    );
};

export default OrderDetailsShow;