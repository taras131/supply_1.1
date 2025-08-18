import React, { FC } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import {RootState} from "../../../store";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {CompletionType} from "../../../models/iOrders";
import {getOrderById} from "../../orders/model/selectors";

interface IProps {
  orderId: string;
  orderItemId: number;
}

const OrderPositionsListItemMenu: FC<IProps> = ({ orderId, orderItemId }) => {
  const dispatch = useAppDispatch();
  const order = useAppSelector((state: RootState) => getOrderById(state, orderId));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenuItemClick = (completionType: CompletionType) => {
/*    dispatch(
      fetchUpdateOrder({
        ...order,
        orderItems: [
          ...order.orderItems.map((orderItem: any) => {
            return orderItem.id === orderItemId ? { ...orderItem, completionType } : orderItem;
          }),
        ],
      }),
    );*/
    handleClose();
  };
  return (
    <div>
      <Button
        id="order-item-positioned-button"
        aria-controls={open ? "order-item-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        +
      </Button>
      <Menu
        id="order-item-positioned-menu"
        aria-labelledby="order-item-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={() => handleMenuItemClick(CompletionType.Cash)}>За наличные</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick(CompletionType.Balance)}>За баланс</MenuItem>
      </Menu>
    </div>
  );
};

export default OrderPositionsListItemMenu;
