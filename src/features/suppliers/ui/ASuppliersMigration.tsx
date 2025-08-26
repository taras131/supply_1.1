import React from 'react';
import {Button} from '@mui/material';
import {collection, getDocs, query} from 'firebase/firestore';
import {db} from '../../../firebase';
import {emptySupplier, INewSupplier} from '../../../models/iSuppliers';
import {useAppDispatch} from '../../../hooks/redux';
import {fetchAddSupplier, fetchCompanyDataByInn} from '../model/actions';
import {setSupplierDate} from "../utils/services";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

async function mapDocToNewSupplierAsync(doc: any): Promise<INewSupplier> {
    const data = doc.data() ?? {}
    console.log(doc)
    await sleep(300);
    return {
        ...emptySupplier,
        name: data.name,
        INN: data.INN,
        firebase_id: String(doc.id),
    };
}

function ASuppliersMigration() {
    const dispatch = useAppDispatch();
    const clickHandler = async () => {
        try {
            const qRef = query(collection(db, 'suppliers'));
            const snap = await getDocs(qRef);
            const suppliers: INewSupplier[] = await Promise.all(
                snap.docs.map((d) => mapDocToNewSupplierAsync(d))
            );
            const dispatchWithDelay = async (items: INewSupplier[], index = 0) => {
                console.log(items[index]);
                if (index >= items.length) return;
                const res = await fetchCompanyDataByInn(+items[index].INN);
                if (res && res[0]) {
                    dispatch(
                        fetchAddSupplier({
                            ...setSupplierDate(res[0]),
                            INN: items[index].INN,
                            firebase_id: items[index].firebase_id,
                        }),
                    );
                }
                setTimeout(() => {
                    dispatchWithDelay(items, index + 1);
                }, 1000);
            };
            await dispatchWithDelay(suppliers);
            console.log('Invoices migration complete. Count:', suppliers.length);
        } catch (e) {
            console.error('Invoices migration failed:', e);
        }
    };
    return <Button onClick={clickHandler}>Стащить</Button>;
}

export default ASuppliersMigration;
