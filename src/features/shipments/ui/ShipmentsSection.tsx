import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {selectShipments} from "../model/selectors";
import InvoicesTable from "../../invoices/ui/InvoicesTable";
import React, {FC, useState, useEffect, memo, useMemo, useCallback, useRef, ChangeEvent} from "react";
import {
    Card,
    Box,
    List,
    alpha,
    SelectChangeEvent, Typography
} from "@mui/material";
import {setInvoices} from "../../invoices/model/slice";
import {defaultInvoice, IInvoice} from "../../../models/iInvoices";
import {IShipments} from "../../../models/iShipments";
import SearchTextField from "../../../components/common/SearchTextField";
import ShipmentsSectionItem from "./ShipmentsSectionItem";

// Дебаунс значения (чтобы фильтрация срабатывала не на каждый символ)
function useDebouncedValue<T>(value: T, delay = 300) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);
    return debounced;
}

const DEBOUNCE_MS = 300;

// Нормализация в нижний регистр (быстрее и короче, чем везде писать .toLowerCase())
const toLower = (v: unknown) => String(v ?? '').toLowerCase();

const ShipmentsSection: FC = () => {
    const dispatch = useAppDispatch();

    // Исходный список
    const allShipments = useAppSelector(selectShipments);
    // Управление состоянием
    const [activeShipmentId, setActiveShipmentId] = useState<string | null>(null);
    const [shipmentsFilter, setShipmentsFilter] = useState<string>('');

    // Для клавиатурной навигации по списку
    const listboxRef = useRef<HTMLDivElement | null>(null);

    // 1) Прединдексация текста поиска (ускоряет фильтрацию на больших списках)
    const searchIndex = useMemo(() => {
        const map = new Map<string, string>();
        for (const s of allShipments) {
            map.set(s.id, toLower(`${s.transporter ?? ''} ${s.lading_number ?? ''}`));
        }
        return map;
    }, [allShipments]);

    // 2) Дебаунс строки поиска (исключает дергание рендера при паузах/наборе)
    const debouncedFilter = useDebouncedValue(shipmentsFilter, DEBOUNCE_MS);

    // 3) Фильтрация по двум полям, поддержка нескольких слов
    const displayedShipments = useMemo<IShipments[]>(() => {
        const q = toLower(debouncedFilter).trim();
        if (!q) return allShipments;

        const tokens = q.split(/\s+/).filter(Boolean);
        if (!tokens.length) return allShipments;

        return allShipments.filter((s) => {
            const text = searchIndex.get(s.id) || '';
            // все токены должны встречаться
            for (const t of tokens) if (!text.includes(t)) return false;
            return true;
        });
    }, [allShipments, debouncedFilter, searchIndex]);

    // 4) Управление активным элементом (без перехвата фокуса у инпута)
    useEffect(() => {
        if (!displayedShipments.length) {
            setActiveShipmentId(null);
            return;
        }
        setActiveShipmentId((prev) => {
            if (prev && displayedShipments.some((s) => s.id === prev)) return prev;
            return displayedShipments[0].id;
        });
        // ВАЖНО: НИЧЕГО НЕ ФОКУСИРУЕМ здесь, чтобы не красть фокус у строки поиска
    }, [displayedShipments]);

    // 5) Индекс и объект активной отгрузки — по отображаемому списку
    const activeIndex = useMemo(() => {
        if (!activeShipmentId) return -1;
        return displayedShipments.findIndex((s) => s.id === activeShipmentId);
    }, [displayedShipments, activeShipmentId]);

    const activeShipment = useMemo<IShipments | null>(() => {
        if (activeIndex < 0) return null;
        return displayedShipments[activeIndex] ?? null;
    }, [displayedShipments, activeIndex]);

    // 6) Прокрутка к активному элементу
    useEffect(() => {
        if (!activeShipmentId) return;
        const el = document.getElementById(`shipment-item-${activeShipmentId}`);
        el?.scrollIntoView({block: 'nearest', behavior: 'smooth'});
    }, [activeShipmentId]);

    // 7) Подгружаем счета активной отгрузки
    useEffect(() => {
        const invoices: IInvoice[] = (activeShipment?.shipment_invoices ?? [])
            .map((si) => {
                const invoice: IInvoice = si.invoice ?? defaultInvoice
                return {...invoice, volume: si.volume};
            })

        dispatch(setInvoices(invoices));
    }, [activeShipment, dispatch]);

    // 8) Навигация по списку (влево/вправо не используем, только вертикально)
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

    // 9) Обработчик ввода — мемоизирован
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
        <Box sx={{display: 'flex', gap: 2, mt: 2, width: '100%'}}>
            {/* Левая колонка: список отгрузок */}
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
                    sx={{height: '70vh', overflow: 'auto', p: 1}}
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
                                    receiving_date={s.receiving_date}
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

            {/* Правая колонка */}
            <Box sx={{flex: 1, minWidth: 0, position: 'relative'}}>
                <Typography variant={"h6"} sx={{position: "absolute", top: 12, left: 12, zIndex: 3}}>
                    Связанные счета
                </Typography>
                <InvoicesTable shipmentMode/>
            </Box>
        </Box>
    );
};

export default memo(ShipmentsSection);