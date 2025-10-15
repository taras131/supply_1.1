import React, {FC, useEffect, useMemo, useState, useCallback} from 'react';
import {Box, Card, List, ListItemButton, ListItemText, Stack, Typography} from '@mui/material';
import OrderPositionsTable from "../../orders_positions/ui/OrderPositionsTable";
import {IOrder} from "../../../models/iOrders";
import {SelectedByOrder} from "./InvoiceAddNewPage";

interface IProps {
    orders: IOrder[];
    selectedByOrder: SelectedByOrder; // { [orderId]: string[] }
    editing?: boolean;
    onPositionsSelectionChange: (orderId: string, positionId: string) => void;
}

const OrdersSection: FC<IProps> = ({
                                       orders,
                                       selectedByOrder,
                                       editing = true,
                                       onPositionsSelectionChange,
                                   }) => {
    // Показываем только заявки с позициями
    const ordersWithPositions = useMemo(
        () => orders.filter(o => !!o.positions && o.positions.length > 0),
        [orders]
    );

    // Активная заявка — хранение по id (сохранит выбор при обновлении массива)
    const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

    // Уточняем активную заявку при изменении списка
    useEffect(() => {
        if (!ordersWithPositions.length) {
            setActiveOrderId(null);
            return;
        }
        // если активной нет или её удалили — берем первую
        const exists = ordersWithPositions.some(o => o.id === activeOrderId);
        if (!exists) {
            setActiveOrderId(ordersWithPositions[0].id);
        }
    }, [ordersWithPositions, activeOrderId]);

    const activeIndex = useMemo(() => {
        if (!activeOrderId) return -1;
        return ordersWithPositions.findIndex(o => o.id === activeOrderId);
    }, [ordersWithPositions, activeOrderId]);

    const activeOrder = activeIndex >= 0 ? ordersWithPositions[activeIndex] : null;

    // Клавиатурная навигация по списку слева
    const moveSelection = useCallback((delta: number) => {
        if (!ordersWithPositions.length) return;
        const from = activeIndex >= 0 ? activeIndex : 0;
        const next = Math.min(Math.max(from + delta, 0), ordersWithPositions.length - 1);
        setActiveOrderId(ordersWithPositions[next].id);
    }, [ordersWithPositions, activeIndex]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (!ordersWithPositions.length) return;
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            moveSelection(-1);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            moveSelection(1);
        } else if (e.key === 'Home') {
            e.preventDefault();
            setActiveOrderId(ordersWithPositions[0].id);
        } else if (e.key === 'End') {
            e.preventDefault();
            setActiveOrderId(ordersWithPositions[ordersWithPositions.length - 1].id);
        }
    }, [ordersWithPositions, moveSelection]);

    return (
        <Box sx={{display: 'flex', gap: 2, mt: 2, width: '100%'}}>
            {/* Левая колонка со списком заявок */}
            <Card
                sx={{
                    width: 320,
                    flexShrink: 0,
                    p: 1,
                    maxHeight: '70vh',
                    overflow: 'auto',
                }}
            >
                <Box
                    tabIndex={0}
                    onKeyDown={handleKeyDown}
                    aria-label="Список заявок"
                    role="listbox"
                >
                    <List dense disablePadding>
                        {ordersWithPositions.map((order, idx) => {
                            const total = order.positions?.length ?? 0;
                            const selectedCount = (selectedByOrder[order.id] ?? []).length;
                            return (
                                <ListItemButton
                                    key={order.id}
                                    role="option"
                                    selected={order.id === activeOrderId}
                                    onClick={() => setActiveOrderId(order.id)}
                                    sx={{
                                        borderRadius: 1,
                                        mb: 0.5,
                                        alignItems: 'flex-start',
                                    }}
                                >
                                    <ListItemText
                                        primary={
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Typography variant="body2" fontWeight={600} noWrap title={order.title}>
                                                    {order.title}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary"
                                                            sx={{ml: 1, flexShrink: 0}}>
                                                    {selectedCount}/{total}
                                                </Typography>
                                            </Stack>
                                        }
                                        secondary={
                                            <Typography variant="caption" color="text.secondary" noWrap
                                                        title={order.id}>
                                                {order.id}
                                            </Typography>
                                        }
                                    />
                                </ListItemButton>
                            );
                        })}
                    </List>
                </Box>
            </Card>

            {/* Правая колонка: одна таблица активной заявки */}
            <Box sx={{flex: 1, minWidth: 0}}>
                {activeOrder ? (
                    <OrderPositionsTable
                        orderId={activeOrder.id}
                        title={activeOrder.title}
                        rows={activeOrder.positions!}
                        selectable={editing}
                        selectedIds={selectedByOrder[activeOrder.id]} // undefined если нет — ОК
                        onToggleChecked={onPositionsSelectionChange}
                    />
                ) : (
                    <Card sx={{p: 3}}>
                        <Typography color="text.secondary">Нет заявок с позициями</Typography>
                    </Card>
                )}
            </Box>
        </Box>
    );
};

export default React.memo(OrdersSection);