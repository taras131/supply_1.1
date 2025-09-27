import React, {ChangeEvent, FC, memo, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {alpha, Box, Card, List, SelectChangeEvent, Typography} from "@mui/material";
import SearchTextField from "../../../components/common/SearchTextField";
import ShipmentsSectionItem from "./ShipmentsSectionItem";
import {IShipments} from "../../../models/iShipments";
import {useAppSelector} from "../../../hooks/redux";
import {selectShipments} from "../model/selectors";

function useDebouncedValue<T>(value: T, delay = 300) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);
    return debounced;
}

const toLower = (v: unknown) => String(v ?? '').toLowerCase();

const DEBOUNCE_MS = 300;

interface IProps {
    activeShipmentId: string | null;
    setActiveShipmentId: React.Dispatch<React.SetStateAction<string | null>>;
}

const ShipmentsSectionNavigation: FC<IProps> = ({activeShipmentId, setActiveShipmentId}) => {
    const allShipments = useAppSelector(selectShipments);
    const [shipmentsFilter, setShipmentsFilter] = useState<string>('');
    const listboxRef = useRef<HTMLDivElement | null>(null);
    const searchIndex = useMemo(() => {
        const map = new Map<string, string>();
        for (const s of allShipments) {
            map.set(s.id, toLower(`${s.transporter ?? ''} ${s.lading_number ?? ''}`));
        }
        return map;
    }, [allShipments]);
    const debouncedFilter = useDebouncedValue(shipmentsFilter, DEBOUNCE_MS);
    const displayedShipments = useMemo<IShipments[]>(() => {
        const q = toLower(debouncedFilter).trim();
        if (!q) return allShipments;
        const tokens = q.split(/\s+/).filter(Boolean);
        if (!tokens.length) return allShipments;
        return allShipments.filter((s) => {
            const text = searchIndex.get(s.id) || '';
            for (const t of tokens) if (!text.includes(t)) return false;
            return true;
        });
    }, [allShipments, debouncedFilter, searchIndex]);
    useEffect(() => {
        if (!displayedShipments.length) {
            setActiveShipmentId(null);
            return;
        }
        setActiveShipmentId((prev) => {
            if (prev && displayedShipments.some((s) => s.id === prev)) return prev;
            return displayedShipments[0].id;
        });
    }, [displayedShipments]);
    const activeIndex = useMemo(() => {
        if (!activeShipmentId) return -1;
        return displayedShipments.findIndex((s) => s.id === activeShipmentId);
    }, [displayedShipments, activeShipmentId]);
    useEffect(() => {
        if (!activeShipmentId) return;
        const el = document.getElementById(`shipment-item-${activeShipmentId}`);
        el?.scrollIntoView({block: 'nearest', behavior: 'smooth'});
    }, [activeShipmentId]);
    const moveSelection = useCallback(
        (delta: number) => {
            if (!displayedShipments.length) return;
            const from = Math.max(
                0,
                Math.min(activeIndex >= 0 ? activeIndex : 0, displayedShipments.length - 1),
            );
            const next = Math.max(0, Math.min(from + delta, displayedShipments.length - 1));
            setActiveShipmentId(displayedShipments[next].id);
        },
        [displayedShipments, activeIndex],
    );
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (!displayedShipments.length) return;

            if (e.key === 'ArrowUp') {
                e.preventDefault();
                moveSelection(-1);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                moveSelection(1);
            } else if (e.key === 'Home') {
                e.preventDefault();
                setActiveShipmentId(displayedShipments[0].id);
            } else if (e.key === 'End') {
                e.preventDefault();
                setActiveShipmentId(displayedShipments[displayedShipments.length - 1].id);
            }
        },
        [displayedShipments, moveSelection],
    );
    const shipmentsFilterChangeHandler = useCallback(
        (
            e:
                | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                | SelectChangeEvent<string | number>,
        ) => {
            setShipmentsFilter(`${e.target.value}`);
        },
        [],
    );
    return (
        <Card
            sx={(theme) => ({
                width: 360,
                flexShrink: 0,
                border: 1,
                borderColor: alpha(theme.palette.divider, 0.04),
            })}
        >
            <Box
                sx={{
                    height: 55,
                    backgroundColor: 'background.default',
                    display: 'flex',
                    alignItems: 'center',
                    px: 1,
                }}
            >
                <SearchTextField
                    placeholder="Поиск..."
                    name="shipments_filter"
                    value={shipmentsFilter}
                    onChange={shipmentsFilterChangeHandler}
                    onClear={() => {
                        setShipmentsFilter('');
                    }}
                    sx={{width: '100%'}}
                />
            </Box>

            {/* Список */}
            <Box
                sx={{
                    maxHeight: '70vh',
                    overflow: 'auto',
                    p: 1
                }}
                ref={listboxRef}
                tabIndex={0}
                onKeyDown={handleKeyDown}
                aria-label="Список отгрузок"
                role="listbox"
                aria-activedescendant={
                    activeShipmentId && displayedShipments.some((s) => s.id === activeShipmentId)
                        ? `shipment-item-${activeShipmentId}`
                        : undefined
                }
            >
                {displayedShipments.length > 0
                    ? (<List dense disablePadding>
                        {displayedShipments.map((s) => (
                            <ShipmentsSectionItem
                                key={s.id}
                                id={s.id}
                                selected={s.id === activeShipmentId}
                                transporter={s.transporter}
                                lading_number={s.lading_number}
                                receiving_date={s.receiving_date || 0}
                                author_date={s.author_date}
                                type={s.type}
                                setActiveShipmentId={setActiveShipmentId}
                            />
                        ))}
                    </List>)
                    : (<Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        width: '100%'
                    }}>
                        <Typography>
                            Ничего не найдено
                        </Typography>
                    </Box>)}

            </Box>
        </Card>
    );
};

export default memo(ShipmentsSectionNavigation);