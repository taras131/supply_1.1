import React, {ChangeEvent, FC, useCallback, useEffect, useId, useState} from "react";
import {
    Stack,
    Typography,
} from "@mui/material";

import AutorenewIcon from "@mui/icons-material/Autorenew";
import {shipmentTypes, transporters} from "../../../utils/const";
import {
    emptyShipment,
    INewShipments, IShipmentsInvoice,
    TShipmentInvoiceValue,
} from "../../../models/iShipments";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import {useAppDispatch} from "../../../hooks/redux";
import ShipmentsAddNewPageHeader from "./ShipmentsAddNewPageHeader";
import {useEditor} from "../../../hooks/useEditor";
import {shipmentValidate} from "../../../utils/validators";
import Card from "@mui/material/Card";
import MyFormControl from "../../../styles/theme/customizations/MyFormControl";
import MySelectControl from "../../../styles/theme/customizations/MySelectControl";
import MyButton from "../../../styles/theme/customizations/MyButton";
import Box from "@mui/material/Box";
import {fetchGetInvoicesForNewShipment} from "../../invoices/model/actions";
import {fetchAddShipment} from "../model/actions";
import {useNavigate} from "react-router-dom";
import InvoicesTableForNewShipment from "../../invoices/ui/InvoicesTableForNewShipment";
import PageTemplate from "../../../components/templates/PageTemplate";

export interface IInvoiceValue {
    value: TShipmentInvoiceValue;
    title: string;
}

export const invoiceValues: IInvoiceValue[] = [
    {value: "partly", title: "Часть"},
    {value: "completely", title: "Весь"},
];

const ShipmentsAddNewPage: FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [ladingFile, setLadingFile] = useState<File | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [selectedInvoicesWithVolume, setSelectedInvoicesWithVolume] = useState<IShipmentsInvoice[]>([]);
    const {
        editedValue,
        errors,
        handleFieldChange,
        resetValue,
    } = useEditor<INewShipments>({
        initialValue: JSON.parse(JSON.stringify(emptyShipment)),
        validate: shipmentValidate,
    });

    useEffect(() => {
        dispatch(fetchGetInvoicesForNewShipment([]))
    }, [dispatch]);
    const saveClickHandler = async () => {
        try {
            await dispatch(fetchAddShipment({
                shipment: {...editedValue, shipment_invoices: selectedInvoicesWithVolume},
                photoFile: photoFile,
                ladingFile: ladingFile,
            }))
            resetValue()
            setLadingFile(null)
            setPhotoFile(null)
            navigate(-1)
        } catch (e) {

        }
    };

    const handleChangePhotoFile = (e: ChangeEvent<HTMLInputElement>) => {
        const list = e.currentTarget.files;
        if (!list || !list[0]) return;
        setPhotoFile(list[0]);
    }
    const handleChangeLandingFile = (e: ChangeEvent<HTMLInputElement>) => {
        const list = e.currentTarget.files;
        if (!list || !list[0]) return;
        setLadingFile(list[0]);
    }
    const onToggleChecked = useCallback((invoiceId: string) => {
        setSelectedInvoicesWithVolume(prev => {
            const exists = prev.some(i => i.invoice_id === invoiceId);
            return exists
                ? prev.filter(i => i.invoice_id !== invoiceId)
                : [...prev, {invoice_id: invoiceId, volume: "completely"}];
        });
    }, []);
    const onChangeInvoiceVolume = useCallback((invoiceId: string, volume: TShipmentInvoiceValue) => {
        setSelectedInvoicesWithVolume(prev =>
            prev.map(i => i.invoice_id === invoiceId ? {...i, volume} : i)
        );
    }, []);
    return (
        <PageTemplate authOnly>
            <ShipmentsAddNewPageHeader isValid={!Object.keys(errors).length}
                                       saveClickHandler={saveClickHandler}/>
            <Card sx={{padding: "36px 28px"}}>
                <Box sx={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr', gap: 3}}>
                    <MySelectControl value={editedValue.transporter}
                                     changeHandler={handleFieldChange}
                                     errorText={errors.transporter}
                                     label={"перевозчик"}
                                     name={"transporter"}
                                     options={transporters.map(transporter => (
                                         {id: transporter, title: transporter})
                                     )}
                                     sx={{gridColumn: '1 / 5'}}
                    />
                    <MySelectControl value={editedValue.type}
                                     changeHandler={handleFieldChange}
                                     errorText={errors.type}
                                     label={"тип перевозки"}
                                     name={"type"}
                                     options={shipmentTypes.map(type => (
                                         {id: type.name, title: type.value})
                                     )}
                                     sx={{gridColumn: '5 / 9'}}
                    />
                    <MyFormControl
                        value={editedValue.lading_number}
                        changeHandler={handleFieldChange}
                        errorText={errors.lading_number}
                        label={"номер накладной"}
                        name={"lading_number"}
                        sx={{gridColumn: '1 / 5'}}
                    />
                    <Box sx={{position: "relative", width: "100%", alignSelf: "stretch", gridColumn: '5 / 7'}}>
                        <MyButton
                            variant="contained"
                            component="label"
                            color={photoFile && photoFile.name ? "warning" : "primary"}
                            fullWidth
                            startIcon={photoFile && photoFile.name ? <AutorenewIcon/> : <FileUploadIcon/>}
                            sx={{height: "100%"}}
                        >
                            {photoFile && photoFile.name ? "Заменить фото" : "Загрузить фото"}
                            <input type="file" hidden onChange={handleChangePhotoFile}/>
                        </MyButton>
                        <Typography variant="caption" sx={{position: "absolute", right: 0, bottom: -23}}>
                            {photoFile && photoFile.name ? photoFile.name : ""}
                        </Typography>
                    </Box>
                    <Box sx={{position: "relative", width: "100%", alignSelf: "stretch", gridColumn: '7 / 9'}}>
                        <MyButton
                            variant="contained"
                            component="label"
                            color={ladingFile && ladingFile.name ? "warning" : "primary"}
                            fullWidth
                            startIcon={ladingFile && ladingFile.name ? <AutorenewIcon/> : <FileUploadIcon/>}
                            sx={{height: "100%"}}
                        >
                            {ladingFile && ladingFile.name ? "Заменить накладную" : "Загрузить накладную"}
                            <input type="file" hidden onChange={handleChangeLandingFile}/>
                        </MyButton>
                        <Typography variant="caption" sx={{position: "absolute", right: 0, bottom: -23}}>
                            {ladingFile && ladingFile.name ? ladingFile.name : ""}
                        </Typography>
                    </Box>
                </Box>
            </Card>
            <InvoicesTableForNewShipment
                selectedInvoicesWithVolume={selectedInvoicesWithVolume}
                onToggleChecked={onToggleChecked}
                onChangeVolume={onChangeInvoiceVolume}/>
        </PageTemplate>);
};

export default ShipmentsAddNewPage;
