import React, {ChangeEvent, useCallback, useEffect, useMemo, useState} from 'react';
import InvoiceAddNewPageHeader from "./InvoiceAddNewPageHeader";
import {FormControl, InputLabel, MenuItem, Select, Stack, Typography} from "@mui/material";
import Card from "@mui/material/Card";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {fetchGetSuppliers} from "../../suppliers/model/actions";
import {selectSuppliersForOptions} from "../../suppliers/model/selectors";
import {useEditor} from "../../../hooks/useEditor";
import {invoiceValidate} from "../../../utils/validators";
import {emptyInvoice, INewInvoice} from "../../../models/iInvoices";
import TextField from "@mui/material/TextField";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import MyButton from "../../../styles/theme/customizations/MyButton";
import Box from "@mui/material/Box";
import {fetchAddInvoice} from "../model/actions";
import {fetchGetOrdersForNewInvoice} from "../../orders/model/actions";
import {selectOrders} from "../../orders/model/selectors";
import OrdersSection from "./OrdersSection";

export type SelectedByOrder = Record<string, string[]>; // { [orderId]: [positionId, ...] }


const InvoiceAddNewPage = () => {
    const dispatch = useAppDispatch();
    const suppliers = useAppSelector(selectSuppliersForOptions);
    const orders = useAppSelector(selectOrders);
    const [file, setFile] = useState<File | null>(null);
    const [selectedByOrder, setSelectedByOrder] = useState<SelectedByOrder>({});
    const {editedValue, errors, handleFieldChange, setEditedValue, resetValue} = useEditor<INewInvoice>({
        initialValue: JSON.parse(JSON.stringify(emptyInvoice)),
        validate: invoiceValidate,
    });
    useEffect(() => {
        dispatch(fetchGetSuppliers())
        dispatch(fetchGetOrdersForNewInvoice())
    }, [dispatch]);
    const handleOrderSelectionChange = useCallback((orderId: string, positionId: string) => {
        setSelectedByOrder(prev => {
            const current = prev[orderId] ?? [];
            const exists = current.includes(positionId);
            const nextForOrder = exists
                ? current.filter(id => id !== positionId)
                : [...current, positionId];
            if (nextForOrder.length === 0) {
                const { [orderId]: _removed, ...rest } = prev;
                return rest; // без пустого массива
            }
            return { ...prev, [orderId]: nextForOrder };
        });
    }, []);
    const selectedPositionIds = useMemo(() => {
        return Object.values(selectedByOrder).flatMap(ids => ids.map(String));
    }, [selectedByOrder]);
    const handleWithVatChange = () => {
        setEditedValue(prev => ({...prev, is_with_vat: !prev.is_with_vat}));
    }
    const handleChangeInputFile = (e: ChangeEvent<HTMLInputElement>) => {
        const list = e.currentTarget.files;
        if (list) {
            setFile(list[0]);
        }
    }
    const saveClickHandler = async () => {
        try {
            await dispatch(fetchAddInvoice({invoice: {...editedValue, positions_id: selectedPositionIds}, file: file}));
            resetValue();
            setFile(null)
        } catch (e) {
        }
    }
    return (
        <Stack sx={{
            width: '100%',
            maxWidth: {sm: '100%', md: '1700px'},
            pt: 1.5,
        }}>
            <InvoiceAddNewPageHeader isValid={!Object.keys(errors).length && !!file}
                                     saveClickHandler={saveClickHandler}/>
            <Card sx={{padding: "28px"}}>
                <Box sx={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', gap: 3}}>
                    <FormControl fullWidth sx={{height: "65px", gridColumn: '1 / 4'}}>
                        <InputLabel id="supplier">Поставщик</InputLabel>
                        <Select
                            labelId="supplier"
                            id="supplier-select"
                            name="supplier_id"
                            value={editedValue.supplier_id}
                            label="Поставщик"
                            onChange={handleFieldChange}
                            variant={"outlined"}
                        >
                            <MenuItem value={"-1"}>Не выбран</MenuItem>
                            {suppliers.map(supplier => (
                                <MenuItem key={supplier.id} value={supplier.id}>
                                    {supplier.title}
                                </MenuItem>
                            ))}
                        </Select>
                        <Typography variant={"subtitle2"} color={"warning"} textAlign={"end"}>
                            {errors.supplier_id}
                        </Typography>
                    </FormControl>
                    <FormControl fullWidth sx={{height: "65px", gridColumn: '4 / 7'}}>
                        <TextField value={editedValue.number}
                                   onChange={handleFieldChange}
                                   name={"number"}
                                   label={"номер счёта"}
                        />
                        <Typography variant={"subtitle2"} color={"warning"} textAlign={"end"}>
                            {errors.number}
                        </Typography>
                    </FormControl>
                    <FormControl fullWidth sx={{height: "65px", gridColumn: '1 / 4'}}>
                        <TextField value={editedValue.amount}
                                   onChange={handleFieldChange}
                                   name={"amount"}
                                   label={"Сумма"}
                                   type="number"
                        />
                        <Typography variant={"subtitle2"} color={"warning"} textAlign={"end"}>
                            {errors.amount}
                        </Typography>
                    </FormControl>
                    <FormControl fullWidth sx={{height: "65px", gridColumn: '4 / 5'}}>
                        <InputLabel id="supplier">НДС</InputLabel>
                        <Select
                            labelId="is_with_vat"
                            id="is_with_vat-select"
                            name="is_with_vat"
                            value={editedValue.is_with_vat ? 1 : 0}
                            label="НДС"
                            onChange={handleWithVatChange}
                            variant={"outlined"}
                        >
                            <MenuItem value={1}>Да</MenuItem>
                            <MenuItem value={0}>Нет</MenuItem>
                        </Select>
                    </FormControl>
                    <Box sx={{height: "55px", position: "relative", gridColumn: '5 / 7'}}>
                        <MyButton
                            variant="contained"
                            component="label"
                            fullWidth
                            startIcon={file && file.name ? <AutorenewIcon/> : <AttachFileIcon/>}
                            sx={{height: "100%"}}
                        >
                            {file && file.name ? "Заменить счёт" : "Прикрепить счёт"}
                            <input type="file" hidden onChange={handleChangeInputFile}/>
                        </MyButton>
                        <Box sx={{
                            position: "absolute",
                            left: "5px",
                            bottom: "-25px"
                        }}>
                            {file && file.name && <Typography variant={"subtitle2"} textAlign={"end"}>
                                Файл: {file.name}
                            </Typography>}
                        </Box>
                    </Box>
                </Box>
            </Card>
            <OrdersSection orders={orders}
                           selectedByOrder={selectedByOrder}
                           onPositionsSelectionChange={handleOrderSelectionChange}/>
        </Stack>
    );
};

export default InvoiceAddNewPage;