import React, {FC} from 'react';
import TitleWithValue from "../../../components/TitleWithValue";
import {IOrder} from "../../../models/iOrders";
import Box from "@mui/material/Box";
import CreateUpdateUserInfo from "../../../components/common/CreateUpdateUserInfo";

interface IProps {
    order: IOrder;
}

const OrderDetailsShow: FC<IProps> = ({order}) => {
    return (
        <Box sx={{padding: "24px 66px 0 24px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "26px"}}>
            <TitleWithValue width={"130px"} title={"Срочность:"}>
                {order.shipments_type === "railway" ? "ЖД" : "Авиа"}
            </TitleWithValue>
            <TitleWithValue width={"170px"} title={"Тип заявки:"}>
                {order.type === "current" ? "Текущая" : "Годовая"}
            </TitleWithValue>
            <TitleWithValue title={"Категория:"}>
                {order.category}
            </TitleWithValue>
            {order.machinery_id && order.machinery &&
                <TitleWithValue title={"Техника:"}>
                    {`${order.machinery.brand} ${order.machinery.model}`}
                </TitleWithValue>
            }
            <CreateUpdateUserInfo author={order.author || null}
                                  createdAT={`${order.created_at}`}
                                  updatedAuthor={order.updated_author || null}
                                  updatedAt={`${order.updated_at}` || null}/>
        </Box>
    );
};

export default OrderDetailsShow;