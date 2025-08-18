import React, { FC } from "react";
import { IconButton, Table, TableBody, TableContainer } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {useAppDispatch} from "../../../hooks/redux";
import {getDateInMilliseconds} from "../../../utils/services";
import OrderPositionsListItem from "./OrderPositionsListItem";
import OrderPositionsListTableHeader from "./OrderPositionsListTableHeader";
import {IOrderPosition} from "../../../models/IOrdersPositions";

interface IProps {
  orderItems: IOrderPosition[];
  isEdit: boolean;
  isLimitedOverview?: boolean;
  orderId: string;
  isSelectPositionMode: boolean;
}

const OrderPositionsList: FC<IProps> = ({
  orderItems,
  isEdit,
  orderId,
  isLimitedOverview = false,
  isSelectPositionMode,
}) => {
  const dispatch = useAppDispatch();
  const handleAddClick = () => {
/*
    dispatch(addEmptyOrderItem(getDateInMilliseconds()));
*/
  };
  const orderItemsList = orderItems.map((orderItem, index) => (
    <OrderPositionsListItem
      key={orderItem.id}
      index={index}
      isEdit={isEdit}
      isLimitedOverview={isLimitedOverview}
      isSelectPositionMode={isSelectPositionMode}
      orderId={orderId}
      orderItem={orderItem}
    />
  ));
  return (
    <TableContainer sx={{ maxWidth: 1350, width: "100%" }}>
      <Table aria-label="order position table">
        <OrderPositionsListTableHeader isLimitedOverview={isLimitedOverview} />
        <TableBody>{orderItemsList}</TableBody>
      </Table>
      {isEdit && (
        <IconButton aria-label="delete" color={"primary"} onClick={handleAddClick}>
          <AddIcon />
        </IconButton>
      )}
    </TableContainer>
  );
};

export default OrderPositionsList;
