import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {selectShipments} from "../model/selectors";
import InvoicesTable from "../../invoices/ui/InvoicesTable";
import React, {FC, useState, useEffect, memo, useMemo, useCallback, useRef} from "react";
import {Stack, Card, Typography, Box, List, ListItemButton, ListItemText, Chip, Tooltip} from "@mui/material";
import {setInvoices} from "../../invoices/model/slice";
import {IInvoice} from "../../../models/iInvoices";
import {IShipments} from "../../../models/iShipments";
import {convertMillisecondsToDate} from "../../../utils/services";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import DirectionsSubwayIcon from "@mui/icons-material/DirectionsSubway";

const ShipmentsSection: FC = () => {
    const dispatch = useAppDispatch();
    const shipments = useAppSelector(selectShipments);
    const [activeShipmentId, setActiveShipmentId] = useState<string | null>(null);
    // ref на контейнер списка (для фокуса)
    const listboxRef = useRef<HTMLDivElement | null>(null);
    // Фокусируем список на старте/при появлении данных
    useEffect(() => {
        if (shipments.length) {
            // сперва обеспечим активный элемент
            setActiveShipmentId((prev) => {
                if (!prev || !shipments.some(s => s.id === prev)) return shipments[0].id;
                return prev;
            });
            // затем сфокусируем список
            // небольшой setTimeout помогает, если список ещё не отрендерился
            setTimeout(() => listboxRef.current?.focus({preventScroll: true}), 0);
        }
    }, [shipments.length]);
    const activeIndex = useMemo(() => {
        if (!activeShipmentId) return -1;
        return shipments.findIndex(s => s.id === activeShipmentId);
    }, [shipments, activeShipmentId]);
    const activeShipment = useMemo<IShipments | null>(() => {
        if (activeIndex < 0) return null;
        return shipments[activeIndex] ?? null;
    }, [shipments, activeIndex]);
    // Прокрутка к активному элементу при изменении
    useEffect(() => {
        if (!activeShipmentId) return;
        const el = document.getElementById(`shipment-item-${activeShipmentId}`);
        // block: 'nearest' — чтобы прокрутка была минимальной и внутри ближайшего скролл-контейнера
        el?.scrollIntoView({block: 'nearest', behavior: 'smooth'});
    }, [activeShipmentId]);
    // Подгружаем счета активной отгрузки в стор
    useEffect(() => {
        const invoices: IInvoice[] = (activeShipment?.shipment_invoices ?? [])
            .map(si => si.invoice)
            .filter((inv): inv is IInvoice => inv != null);
        dispatch(setInvoices(invoices));
    }, [activeShipment, dispatch]);
    // Навигация по списку
    const moveSelection = useCallback((delta: number) => {
        if (!shipments.length) return;
        const from = Math.max(0, Math.min(activeIndex >= 0 ? activeIndex : 0, shipments.length - 1));
        const next = Math.max(0, Math.min(from + delta, shipments.length - 1));
        setActiveShipmentId(shipments[next].id);
    }, [shipments, activeIndex]);
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!shipments.length) return;
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            moveSelection(-1);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            moveSelection(1);
        } else if (e.key === 'Home') {
            e.preventDefault();
            setActiveShipmentId(shipments[0].id);
        } else if (e.key === 'End') {
            e.preventDefault();
            setActiveShipmentId(shipments[shipments.length - 1].id);
        }
    }, [shipments, moveSelection]);
    return (
        <Box sx={{display: 'flex', gap: 2, mt: 2, width: '100%'}}>
            {/* Левая колонка: список отгрузок */}
            <Card sx={{width: 360, flexShrink: 0, p: 1, maxHeight: '70vh', overflow: 'auto'}}>
                <Box
                    ref={listboxRef}
                    tabIndex={0}
                    onKeyDown={handleKeyDown}
                    aria-label="Список отгрузок"
                    role="listbox"
                    aria-activedescendant={activeShipmentId ? `shipment-item-${activeShipmentId}` : undefined}
                >
                    <List dense disablePadding>
                        {shipments.map((s) => {
                            const total = s.shipment_invoices?.length ?? 0;
                            const selected = s.id === activeShipmentId;
                            return (
                                <ListItemButton
                                    // id нужен для scrollIntoView и aria-activedescendant
                                    id={`shipment-item-${s.id}`}
                                    key={s.id}
                                    role="option"
                                    selected={selected}
                                    aria-selected={selected}
                                    onClick={() => setActiveShipmentId(s.id)}
                                    sx={{borderRadius: 1, mb: 0.5, alignItems: 'flex-start'}}
                                >
                                    <ListItemText
                                        slotProps={{
                                            primary: {component: 'div'},
                                            secondary: {component: 'div'},
                                        }}
                                        primary={
                                            <Stack direction="row" justifyContent="space-between" alignItems="center"
                                                   spacing={1}>
                                                <Stack direction={"row"} spacing={1} sx={{minWidth: 0}}
                                                       alignItems={"center"}>
                                                    <Typography variant="body2" fontWeight={600} noWrap>
                                                        {s.transporter}
                                                    </Typography>
                                                    <Typography variant="subtitle2" color="text.secondary">
                                                        {s.lading_number}
                                                    </Typography>
                                                </Stack>
                                                <Stack direction="row" spacing={1} sx={{flexShrink: 0}}>
                                                    {s.type === "air"
                                                        ? (<Tooltip title={"Авиа отправка"}>
                                                            <AirplanemodeActiveIcon
                                                                color={s.receiving_date && s.receiving_date > 0
                                                                    ? 'success'
                                                                    : 'secondary'}/>
                                                        </Tooltip>)
                                                        : (
                                                            <Tooltip title={"ЖД отправка"}>
                                                                <DirectionsSubwayIcon
                                                                    color={s.receiving_date && s.receiving_date > 0
                                                                        ? 'success'
                                                                        : 'secondary'}/>
                                                            </Tooltip>)}
                                                </Stack>
                                            </Stack>
                                        }
                                        secondary={
                                            <Stack direction="row"
                                                   spacing={1}
                                                   alignItems="center"
                                                   justifyContent={"space-between"}
                                                   mt={1}>
                                                <Typography variant="caption" color="text.secondary" noWrap>
                                                    Отгружено: {convertMillisecondsToDate(s.author_date)}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" noWrap>
                                                    {s.receiving_date && s.receiving_date > 0
                                                        ? `Получено: ${convertMillisecondsToDate(s.receiving_date)}`
                                                        : "в пути"}
                                                </Typography>
                                            </Stack>
                                        }
                                    />
                                </ListItemButton>
                            );
                        })}
                    </List>
                </Box>
            </Card>
            {/* Правая колонка */}
            <Box sx={{flex: 1, minWidth: 0}}>
                <InvoicesTable/>
            </Box>
        </Box>
    );
};
export default memo(ShipmentsSection);