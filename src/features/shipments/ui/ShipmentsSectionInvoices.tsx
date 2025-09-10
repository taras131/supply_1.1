import React, {FC, useCallback, useEffect, useState} from 'react';
import {Box, Button, ButtonGroup, Stack, Typography} from "@mui/material";
import InvoicesTableForNewShipment from "../../invoices/ui/InvoicesTableForNewShipment";
import InvoicesTableForShipment from "../../invoices/ui/InvoicesTableForShipment";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {selectShipmentsIsLoading} from "../model/selectors";
import {selectInvoicesIsLoading} from "../../invoices/model/selectors";
import {IShipments, IShipmentsInvoice, TShipmentInvoiceValue} from "../../../models/iShipments";
import {defaultInvoice, IInvoice} from "../../../models/iInvoices";
import {fetchGetInvoicesForNewShipment} from "../../invoices/model/actions";
import {setInvoices} from "../../invoices/model/slice";
import {fetchUpdateShipmentInvoices} from "../model/actions";

interface IProps {
    activeShipment: IShipments;
}

const ShipmentsSectionInvoices: FC<IProps> = ({activeShipment}) => {
    const dispatch = useAppDispatch();
    const [invoiceEditing, setInvoiceEditing] = useState(false);
    const [selectedInvoicesWithVolume, setSelectedInvoicesWithVolume] = useState<IShipmentsInvoice[]>([]);
    const shipmentsIsLoading = useAppSelector(selectShipmentsIsLoading)
    useEffect(() => {
        if (!activeShipment) return;
        const invoices: IInvoice[] = (activeShipment.shipment_invoices ?? [])
            .map((si) => {
                const invoice: IInvoice = si.invoice ?? defaultInvoice
                return {...invoice, volume: si.volume};
            })
        if (invoiceEditing) {
            dispatch(fetchGetInvoicesForNewShipment(invoices))
        }
        if (!invoiceEditing) {
            dispatch(setInvoices(invoices));
        }
    }, [invoiceEditing, dispatch, activeShipment]);
    useEffect(() => {
        if (activeShipment && activeShipment.shipment_invoices) {
            setSelectedInvoicesWithVolume(activeShipment.shipment_invoices.map(si => ({
                invoice_id: si.invoice_id,
                volume: si.volume
            })));
        }
    }, [activeShipment])
    const invoicesIsLoading = useAppSelector(selectInvoicesIsLoading)
    const toggleInvoiceEditing = () => {
        setInvoiceEditing(prev => !prev);
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
    const updateShipmenInvoiceClickHandler = async () => {
        try {
            if (activeShipment) {
                setInvoiceEditing(false)
                await dispatch(fetchUpdateShipmentInvoices(
                    {...activeShipment, shipment_invoices: selectedInvoicesWithVolume},
                ))
            }
        } catch (e) {

        }
    }
    const isLoading = shipmentsIsLoading || invoicesIsLoading
    return (
        <Box sx={{flex: 1, minWidth: 0, position: 'relative'}}>
            <Stack direction={"row"}
                   spacing={7}
                   alignItems={"center"}
                   sx={{position: "absolute", top: 10, left: 12, zIndex: 3}}>
                <Typography variant={"h6"}>
                    Связанные счета:
                </Typography>
                {invoiceEditing
                    ? (<ButtonGroup>
                        <Button
                            onClick={toggleInvoiceEditing}
                            color={"warning"}
                            variant="text"
                            size={"small"}
                            loading={isLoading}
                            sx={{
                                textTransform: 'none'
                            }}>
                            Отменить
                        </Button>
                        <Button
                            onClick={updateShipmenInvoiceClickHandler}
                            color={"success"}
                            variant="text"
                            size={"small"}
                            loading={isLoading}
                            sx={{
                                textTransform: 'none'
                            }}>
                            Сохранить
                        </Button>
                    </ButtonGroup>)
                    : (<Button
                        onClick={toggleInvoiceEditing}
                        size={"small"}
                        variant="text"
                        loading={isLoading}
                        sx={{
                            textTransform: 'none'
                        }}>
                        Изменить
                    </Button>)}
            </Stack>
            {invoiceEditing
                ? (<InvoicesTableForNewShipment selectedInvoicesWithVolume={selectedInvoicesWithVolume}
                                                onToggleChecked={onToggleChecked}
                                                onChangeVolume={onChangeInvoiceVolume}/>)
                : (<InvoicesTableForShipment/>)}
        </Box>
    );
};

export default ShipmentsSectionInvoices;