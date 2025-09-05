import React from 'react';
import {useAppDispatch} from "../../../hooks/redux";
import {collection, getDocs, query} from "firebase/firestore";
import {db} from "../../../firebase";
import {userAPI} from "../../users/api";
import {Button} from "@mui/material";
import {INewShipments} from "../../../models/iShipments";
import {fetchAddShipment} from "../model/actions";
import {invoicesAPI} from "../../invoices/api";

async function mapDocToNewShipmentAsync(doc: any): Promise<INewShipments> {
    const data = doc.data() ?? {};
    console.log(data)
    return {
        firebase_id: doc.id,
        transporter: data.transporter,
        lading_number: data.ladingNumber,
        lading_file_path: data.ladingNumberFilePath ?? null,
        receiving_is_receiving: data.receiving?.dateCreating ?? false,
        receiving_date: data.receiving?.dateCreating ?? 0,
        type: data.type,
        shipment_invoices: [...data.invoicesList.map((invoice: any) => (
            {invoice_id: invoice.invoiceId, volume: invoice.volume}))],
        author_id: data.author?.userId ?? null,
        author_date: data.author?.dateCreating ? data.author?.dateCreating : 0,
        receiving_author_id: data.receiving?.userId ?? null,
    };
}

const AShipmentsMigration = () => {
    const dispatch = useAppDispatch();
    const clickHandler = async () => {
        try {
            const qRef = query(collection(db, 'shipments'));
            const snap = await getDocs(qRef);
            const shipments: INewShipments[] = await Promise.all(
                snap.docs.map((d) => mapDocToNewShipmentAsync(d))
            );
            const dispatchWithDelay = async (shipments: INewShipments[], index = 0) => {
                const authorId = shipments[index].author_id
                if (authorId) {
                    try {
                        shipments[index].author_id = await userAPI.getByFirebaseId(authorId);
                    } catch (e) {
                        console.log(e)
                    }
                }
                const receivingAuthorId = shipments[index].receiving_author_id
                if (receivingAuthorId) {
                    try {
                        shipments[index].receiving_author_id = await userAPI.getByFirebaseId(receivingAuthorId);
                    } catch (e) {
                        console.log(e)
                    }
                }
                const invoicesList = shipments[index].shipment_invoices ?? [];
                if (invoicesList.length > 0) {
                    try {
                        shipments[index].shipment_invoices = await Promise.all(
                            invoicesList.map(async (invoice) => {
                                const actual = await invoicesAPI.getByFirebaseId(invoice.invoice_id);
                                const actualId = typeof actual === 'string' ? actual : actual.id;
                                return {...invoice, invoice_id: actualId};
                            })
                        );
                    } catch (e) {
                        console.log(e)
                    }
                }
                if (index >= shipments.length) return;
                const shipment_in = {
                    ...shipments[index],
                }
                await dispatch(fetchAddShipment({shipment: shipment_in}));
                setTimeout(() => {
                    dispatchWithDelay(shipments, index + 1);
                }, 500);
            };
            await dispatchWithDelay(shipments);
            console.log('Shipments migration complete. Count:', shipments.length);
        } catch (e) {
            console.error('Shipments migration failed:', e);
        }
    };
    return (<Button onClick={clickHandler}>Мигрировать отгрузки</Button>);
};

export default AShipmentsMigration;