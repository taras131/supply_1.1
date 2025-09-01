import React, {FC, useCallback, useMemo, useState} from "react";
import * as XLSX from "xlsx";
import LoadingButton from "@mui/lab/LoadingButton";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {selectAllMachinery} from "../../machinery/model/selectors";
import {INewOrder} from "../../../models/iOrders";
import {emptyOrderPosition, INewOrderPosition} from "../../../models/IOrdersPositions";
import {getWordAfter} from "../../../utils/services";
import {setMessage} from "../../messages/model/slice";
import {MESSAGE_SEVERITY} from "../../../utils/const";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {Button} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";


const unitMeasureParsed = (unitMeasure: string): string => {
    let res = "шт"
    if (unitMeasure === "компл" || unitMeasure === "компл." || unitMeasure === "ком." || unitMeasure === "ком"
        || unitMeasure === "комп" || unitMeasure === "комп." || unitMeasure === "к." || unitMeasure === "к"
        || unitMeasure === "комплект." || unitMeasure === "комплект") {
        res = "комп"
    }
    if (unitMeasure === "метр" || unitMeasure === "метр." || unitMeasure === "м." || unitMeasure === "м") {
        res = "метр"
    }
    if (unitMeasure === "кг" || unitMeasure === "кг." || unitMeasure === "килограмм." || unitMeasure === "килограмм"
        || unitMeasure === "кило" || unitMeasure === "кило.") {
        res = "кг"
    }
    if (unitMeasure === "литр" || unitMeasure === "литр." || unitMeasure === "л." || unitMeasure === "л") {
        res = "литр"
    }
    return res
}

interface IProps {
    setEditedValue: React.Dispatch<React.SetStateAction<INewOrder>>;
}

type RawCell = string | number | boolean | Date | null | undefined;
type RawRow = RawCell[];
const isString = (v: unknown): v is string => typeof v === 'string';
const toStr = (v: unknown) => (typeof v === 'string' ? v : v == null ? '' : String(v));

const OrderExcelReader: FC<IProps> = ({setEditedValue}) => {
    const dispatch = useAppDispatch();
    const [fileName, setFileName] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const machineryList = useAppSelector(selectAllMachinery);
    // Построим карту VIN -> machinery_id для быстрого поиска
    const machineryByVIN = useMemo(() => {
        const map = new Map<string, string>();
        for (const m of machineryList) {
            const key = toStr(m.vin).trim().toUpperCase();
            if (key) map.set(key, m.id);
        }
        return map;
    }, [machineryList]);
    const handleFileChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setIsLoading(true);
            try {
                const file = event.target.files?.[0];
                if (!file) {
                    setIsLoading(false);
                    return;
                }
                setFileName(file.name.replace(/\.[^.]+$/, '')); // без расширения
                const reader = new FileReader();
                reader.onload = (e: ProgressEvent<FileReader>) => {
                    try {
                        const bufferArray = e.target?.result;
                        if (!bufferArray || !(bufferArray instanceof ArrayBuffer)) {
                            throw new Error('Невалидный формат файла');
                        }
                        const workbook = XLSX.read(bufferArray, {type: 'array'});
                        const sheetName = workbook.SheetNames[0];
                        const sheet = workbook.Sheets[sheetName];
                        if (!sheet) throw new Error('Лист не найден');
                        // header: 1 -> массив строк (массивов ячеек)
                        const rows = XLSX.utils.sheet_to_json<RawRow>(sheet, {header: 1});
                        // 1) Попробуем найти VIN один раз
                        let foundMachineryId: string | undefined;
                        outer: for (const row of rows) {
                            for (const cell of row) {
                                if (isString(cell)) {
                                    if (cell.includes('VIN' || 'Vin' || 'vin')) {
                                        const vin = getWordAfter(cell, 'VIN')?.trim();
                                        console.log(vin)
                                        if (vin) {
                                            const id = machineryByVIN.get(vin.toUpperCase());
                                            if (id) {
                                                foundMachineryId = id;
                                                break outer;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (foundMachineryId) {
                            setEditedValue(prev => ({...prev, machinery_id: `${foundMachineryId}`}));
                        }
                        // 2) Соберём позиции
                        const orderItems: INewOrderPosition[] = [];
                        let isBodyOrdersStart = false;
                        rows.forEach((row, index) => {
                            const first = row[0];
                            if (Number(first) === 1) isBodyOrdersStart = true;
                            if (!isBodyOrdersStart) return;
                            const name = isString(row[1]) ? row[1].trim() : '';
                            const catalogNumber = isString(row[2]) ? row[2].trim() : '';
                            const countArr = `${row[3]}`.split(" ")

                            const count = Number(countArr[0] || 0)// безопаснее, чем parseInt на unknown

                            const lastString =
                                [...row]
                                    .reverse()
                                    .find(c => isString(c) && c.trim() !== '') as string | undefined;

                            const cell3s = toStr(row[3]).trim();
                            const cell4s = toStr(row[4]).trim();
                            const unit_measure = unitMeasureParsed((countArr[1] ? countArr[1] : cell4s).toLowerCase())
                            const comment =
                                lastString && lastString !== cell3s && lastString !== cell4s ? lastString : '';
                            // Явные скобки для условия
                            const hasValidName = name.length > 1;
                            const hasValidCat = catalogNumber.length > 1;
                            const hasValidCount = Number.isFinite(count) && count > 0;
                            if ((hasValidCount && hasValidName) || hasValidCat) {
                                orderItems.push({
                                    ...emptyOrderPosition,
                                    id: index,
                                    name,
                                    catalog_number: catalogNumber,
                                    count: hasValidCount ? count : 0,
                                    comment,
                                    is_ordered: false,
                                    unit_measure: unit_measure
                                });
                            }
                        });
                        if (orderItems.length > 0) {
                            setEditedValue(prev => ({
                                ...prev,
                                positions: orderItems,
                                title: file.name.replace(/\.[^.]+$/, ''),
                            }));
                            dispatch(
                                setMessage({
                                    text: `Загружено позиций: ${orderItems.length}`,
                                    severity: MESSAGE_SEVERITY.success,
                                })
                            );
                        } else {
                            dispatch(
                                setMessage({
                                    text: 'Не удалось прочитать файл',
                                    severity: MESSAGE_SEVERITY.warning,
                                })
                            );
                        }
                    } catch (err: any) {
                        dispatch(
                            setMessage({
                                text: err?.message || 'Ошибка при чтении файла',
                                severity: MESSAGE_SEVERITY.error,
                            })
                        );
                    } finally {
                        setIsLoading(false);
                    }
                };
                reader.onerror = () => {
                    dispatch(
                        setMessage({
                            text: 'Ошибка чтения файла',
                            severity: MESSAGE_SEVERITY.error,
                        })
                    );
                    setIsLoading(false);
                };
                reader.readAsArrayBuffer(file);
            } catch (e) {
                setIsLoading(false);
            } finally {
                event.target.value = '';
            }
        },
        [dispatch, fileName, machineryByVIN, setEditedValue]
    );
    return (
        <Tooltip title={"вы можете загрузить заявку из файла exel"}>
            <Button
                component="label"
                loading={isLoading}
                variant="contained"
                startIcon={<CloudUploadIcon/>}
            >
                Загрузить файл
                <input type="file" accept=".xls,.xlsx" hidden onChange={handleFileChange}/>
            </Button>
        </Tooltip>
    );
};
export default OrderExcelReader;