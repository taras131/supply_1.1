import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../../firebase";
import {machineryAPI} from "../../machinery/api";
import {INewOrderPosition} from "../../../models/IOrdersPositions";
import {INewOrder} from "../../../models/iOrders";
import {useAppDispatch} from "../../../hooks/redux";
import {Button} from "@mui/material";
import {fetchAddOrder} from "../model/actions";


const isUUID = (v: unknown): v is string =>
    typeof v === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v as string);

// Кэш соответствий: firebase_machinery_id -> server_uuid | null
const machineryCache = new Map<string, string | null>();

async function resolveMachineryUuid(firebaseMachineryId?: string): Promise<string | null> {
    const fid = (firebaseMachineryId ?? '').trim();
    if (!fid) return null;

    if (machineryCache.has(fid)) return machineryCache.get(fid)!;

    try {
        const m = await machineryAPI.getByFirebaseId(fid);
        const uuid = typeof m?.id === 'string' && isUUID(m.id) ? m.id : null;
        machineryCache.set(fid, uuid);
        if (!uuid) console.warn('Machinery found but invalid id format', { fid, m });
        return uuid;
    } catch (e) {
        console.warn('Machinery not found by firebase id', fid, e);
        machineryCache.set(fid, null);
        return null;
    }
}

const normalizeShipmentType = (s?: string): string => {
    const allowed = new Set(['air', 'sea', 'road', 'rail']);
    const v = (s || '').toLowerCase();
    return allowed.has(v) ? v : 'air';
};

const normalizeOrderType = (t?: string): string => {
    const allowed = new Set(['current', 'future', 'other']);
    const v = (t || '').toLowerCase();
    return allowed.has(v) ? v : 'current';
};

function mapFirebaseItemToPosition(item: any, idx: number): INewOrderPosition {
    return {
        id: typeof item?.id === 'number' ? item.id : idx, // временный id для грида
        name: item?.name ?? '',
        catalog_number: item?.catalogNumber ?? '',
        count: Number(item?.count ?? 0),
        comment: item?.comment ?? '',
        is_ordered: Boolean(item?.isOrdered),
        completion_type: null,
        photos: [],
        link: '',
        invoice_id: item?.invoiceId ?? null,
        assigned_to_id: null,
    };
}

async function mapDocToNewOrderAsync(doc: any): Promise<INewOrder> {
    const data = doc.data() ?? {};
    const approved = data.approved ?? {};
    const cancel = data.cancel ?? {};

    const fbCreated = Number(data?.author?.dateCreating ?? 0);
    const createdAtIso =
        fbCreated > 0 ? new Date(fbCreated).toISOString() : new Date().toISOString();

    // Резолвим UUID техники по firebase machineryId
    const machinery_id = await machineryAPI.getByFirebaseId(data.machineryId);

    const positions: INewOrderPosition[] = Array.isArray(data.orderItems)
        ? data.orderItems.map((it: any, idx: number) => mapFirebaseItemToPosition(it, idx))
        : [];

    return {
        firebase_id: doc.id || '',
        title: data?.title || 'Без названия',
        category: '-1', // при отправке на сервер не включаем (если бэк не ждёт)
        shipments_type: data?.shipmentType,
        type: data?.orderType,

        is_approved: Boolean(approved?.isApproved),
        approved_date: Number(approved?.date ?? 0),
        approved_author_id: null, // при необходимости замапьте через словарь uid->uuid

        is_cancel: Boolean(cancel?.isCancel ?? false),
        cancel_date: Number(cancel?.date ?? 0),
        cancel_author_id: null, // при необходимости замапьте через словарь uid->uuid

        machinery_id: machinery_id,

        created_at: createdAtIso,
        positions,
    };
}

// Если очистка payload происходит не в API-слое, можно использовать этот помощник
function toServerPayload(o: INewOrder) {
    return {
        firebase_id: o.firebase_id || undefined,
        title: o.title,
        shipments_type: o.shipments_type,
        type: o.type,
        is_approved: o.is_approved ?? undefined,
        approved_date: o.approved_date ?? undefined,
        approved_author_id: isUUID(o.approved_author_id || '') ? o.approved_author_id : undefined,
        is_cancel: o.is_cancel ?? undefined,
        cancel_date: o.cancel_date ?? undefined,
        cancel_author_id: isUUID(o.cancel_author_id || '') ? o.cancel_author_id : undefined,
        machinery_id: isUUID(o.machinery_id || '') ? o.machinery_id : undefined,
        positions: (o.positions ?? []).map(({ id, ...rest }) => rest), // убираем временный id
    };
}

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

const AOrdersMigration = () => {
    const dispatch = useAppDispatch();

    const clickHandler = async () => {
        try {
            // 1) Читаем все заказы разово
            const qRef = query(collection(db, 'orders'));
            const snap = await getDocs(qRef);

            // 2) (Опционально) прогреем кэш техники для уникальных machineryId — быстрее и меньше запросов
            const uniqueMachIds = Array.from(
                new Set(
                    snap.docs
                        .map((d) => String(d.data()?.machineryId || '').trim())
                        .filter((v) => v.length > 0)
                )
            );
            await Promise.all(uniqueMachIds.map((fid) => resolveMachineryUuid(fid)));

            // 3) Маппим документы в INewOrder c уже заполненным machinery_id
            const orders: INewOrder[] = await Promise.all(
                snap.docs.map((d) => mapDocToNewOrderAsync(d))
            );

            // 4) Отправляем по одному, с паузой
            for (let i = 0; i < orders.length; i++) {
                const order = orders[i];

                // Если ваш ordersAPI.add уже чистит payload (удаляет positions.id и пр.), то просто:
                await dispatch(fetchAddOrder(order)).unwrap().catch((err: any) => {
                    console.error('Failed to migrate order', order.firebase_id, err);
                });

                // Если нет — можно отправлять toServerPayload(order) через отдельный thunk/API-метод

                await sleep(500);
            }

            console.log('Migration done. Count:', orders.length);
        } catch (e) {
            console.error('Migration failed:', e);
        }
    };

    return <Button onClick={clickHandler}>Стащить</Button>;
};

export default AOrdersMigration;