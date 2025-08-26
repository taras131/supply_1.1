import React from 'react';
import {collection, getDocs, query} from 'firebase/firestore';
import {useAppDispatch} from "../../../hooks/redux";
import {db} from "../../../firebase";
import {INewInvoice} from "../../../models/iInvoices";
import {fetchAddInvoice} from "../model/actions";
import {Button} from "@mui/material";
import {suppliersAPI} from "../../suppliers/api";
import {userAPI} from "../../users/api";

async function mapDocToNewInvoiceAsync(doc: any): Promise<INewInvoice> {
    const data = doc.data() ?? {};
    return {
        firebase_id: data.id,
        amount: data.amount || 0,

        approved_date: data.approved?.date,
        approved_is_approved: data.approved?.isApproved,
        approved_user_id: data.approved?.userId || null,

        author_date: +data.author?.date || 0,
        author_id: data.author.userId,

        cancel_date: data.cancel?.date || 0,
        cancel_is_cancel: data.cancel?.isCancel || false,
        cancel_user_id: data.cancel?.userId || null,

        invoice_file_link: data.invoiceFileLink,
        is_with_vat: data.isWithVAT,

        number: data.number,

        paid_date: data.paid?.date || 0,
        paid_is_paid: data.paid?.isPaid || false,
        paid_payment_order_file_link: data.paid?.paymentOrderFileLink || "",
        paid_user_id: data.paid?.userId || null,
        supplier_id: data.supplierId,
    };
}

const AInvoicesMigration: React.FC = () => {
    const dispatch = useAppDispatch();
    const clickHandler = async () => {
        try {
            const qRef = query(collection(db, 'invoices'));
            const snap = await getDocs(qRef);
            const invoices: INewInvoice[] = await Promise.all(
                snap.docs.map((d) => mapDocToNewInvoiceAsync(d))
            );
            const dispatchWithDelay = async (items: INewInvoice[], index = 0) => {
                console.log(items[index]);
                const supplier = await suppliersAPI.getByFirebaseId(items[index].supplier_id);
                let author = null
                const authorId = items[index].author_id
                if (authorId) {
                    author = await userAPI.getByFirebaseId(authorId);
                }
                let paid_user = null
                const paidUserId = items[index].paid_user_id
                if (paidUserId) {
                    paid_user = await userAPI.getByFirebaseId(paidUserId);
                }

                let cancel_user = null
                const cancelUserId = items[index].cancel_user_id
                if (cancelUserId) {
                    cancel_user = await userAPI.getByFirebaseId(cancelUserId);
                }

                let approved_user = null
                const approvedUserId = items[index].approved_user_id
                if (approvedUserId) {
                    approved_user = await userAPI.getByFirebaseId(approvedUserId);
                }
                if (index >= items.length) return;
                const invoice_in = {
                    ...items[index],
                    supplier_id: supplier.id,
                    author_id: author?.id,
                    paid_user_id: paid_user?.id,
                    cancel_user_id: cancel_user?.id,
                    approved_user_id: approved_user?.id
                }
                await dispatch(fetchAddInvoice({invoice: invoice_in}));
                setTimeout(() => {
                    dispatchWithDelay(items, index + 1);
                }, 1000);
            };
            await dispatchWithDelay(invoices);
            console.log('Invoices migration complete. Count:', invoices.length);
        } catch (e) {
            console.error('Invoices migration failed:', e);
        }
    };
    return (<Button onClick={clickHandler}>Мигрировать инвойсы</Button>);
};
export default AInvoicesMigration;