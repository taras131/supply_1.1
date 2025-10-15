import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {selectCurrentInvoice, selectInvoicesIsLoading} from "../../invoices/model/selectors";
import Box from "@mui/material/Box";
import {Button, ButtonGroup, Stack, Typography} from "@mui/material";
import {selectOrders, selectOrdersIsLoading} from "../../orders/model/selectors";
import OrdersSection from "../../invoices/ui/OrdersSection";
import {SelectedByOrder} from "../../invoices/ui/InvoiceAddNewPage";
import {fetchGetSuppliers} from "../../suppliers/model/actions";
import {fetchGetOrdersForInvoice} from "../../orders/model/actions";
import {fetchUpdateInvoice} from "../../invoices/model/actions";

const OrderPositionsTableForInvoice = () => {
    const dispatch = useAppDispatch();
    const currentInvoice = useAppSelector(selectCurrentInvoice);
    const [ordersPositionsEditing, setOrdersPositionsEditing] = useState(false);
    const orders = useAppSelector(selectOrders);
    const [selectedByOrder, setSelectedByOrder] = useState<SelectedByOrder>({});
    const invoicesLoading = useAppSelector(selectInvoicesIsLoading)
    const ordersLoading = useAppSelector(selectOrdersIsLoading)
    useEffect(() => {
        if (currentInvoice) {
            dispatch(fetchGetSuppliers())
            dispatch(fetchGetOrdersForInvoice(currentInvoice.id))
        }
    }, [dispatch, currentInvoice]);
    useEffect(() => {
        const initialSelection: SelectedByOrder = {};
        orders.forEach(order => {
            const matched = order.positions
                ?.filter(pos => pos.invoice_id === currentInvoice?.id)
                .map(pos => pos.id.toString()) || [];
            if (matched.length > 0) {
                initialSelection[order.id] = matched;
            }
        });
        setSelectedByOrder(initialSelection);
    }, [orders, currentInvoice]);
    const selectedPositionIds = useMemo(() => {
        return Object.values(selectedByOrder).flatMap(ids => ids.map(String));
    }, [selectedByOrder]);
    const toggleOrdersPositionsEditing = () => {
        setOrdersPositionsEditing(prev => !prev);
    }
    const updateOrdersPositionsHandler = () => {
        if (currentInvoice) {
            dispatch(fetchUpdateInvoice({...currentInvoice, positions_id: selectedPositionIds}))
            setOrdersPositionsEditing(false);
        }
    }
    const handleOrderSelectionChange = useCallback((orderId: string, positionId: string) => {
        setSelectedByOrder(prev => {
            const current = prev[orderId] ?? [];
            const exists = current.includes(positionId);
            const nextForOrder = exists
                ? current.filter(id => id !== positionId)
                : [...current, positionId];
            if (nextForOrder.length === 0) {
                const {[orderId]: _removed, ...rest} = prev;
                return rest; // без пустого массива
            }
            return {...prev, [orderId]: nextForOrder};
        });
    }, []);
    const displayedOrders = useMemo(() => {
        if (ordersPositionsEditing || !currentInvoice) {
            return orders;
        }
        return orders
            .map(order => {
                const filteredPositions = order.positions?.filter(
                    pos => pos.invoice_id === currentInvoice.id
                ) ?? [];
                return {...order, positions: filteredPositions};
            })
            .filter(order => (order.positions?.length ?? 0) > 0);
    }, [orders, ordersPositionsEditing, currentInvoice]);
    return (
        <Box sx={{flex: 1, minWidth: 0, position: 'relative'}}>
            <Stack direction={"row"}
                   spacing={7}
                   alignItems={"center"}>
                <Typography variant={"h6"}>
                    Связанные заявки:
                </Typography>
                {ordersPositionsEditing
                    ? (<ButtonGroup>
                        <Button
                            onClick={toggleOrdersPositionsEditing}
                            color={"warning"}
                            variant="text"
                            size={"small"}
                            loading={invoicesLoading || ordersLoading}
                            sx={{
                                textTransform: 'none'
                            }}>
                            Отменить
                        </Button>
                        <Button
                            onClick={updateOrdersPositionsHandler}
                            color={"success"}
                            variant="text"
                            size={"small"}
                            loading={invoicesLoading || ordersLoading}
                            sx={{
                                textTransform: 'none'
                            }}>
                            Сохранить
                        </Button>
                    </ButtonGroup>)
                    : (<Button
                        onClick={toggleOrdersPositionsEditing}
                        size={"small"}
                        variant="text"
                        loading={invoicesLoading || ordersLoading}
                        sx={{
                            textTransform: 'none'
                        }}>
                        Изменить
                    </Button>)}
            </Stack>
            <OrdersSection orders={displayedOrders}
                           selectedByOrder={selectedByOrder}
                           editing={ordersPositionsEditing}
                           onPositionsSelectionChange={handleOrderSelectionChange}/>
        </Box>
    );
};

export default OrderPositionsTableForInvoice;