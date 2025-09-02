import {collection, getDocs, query} from "firebase/firestore";
import {db} from "../../../firebase";
import {emptyOrder, INewOrder} from "../../../models/iOrders";
import {useAppDispatch} from "../../../hooks/redux";
import {Button} from "@mui/material";
import {fetchAddOrder} from "../model/actions";
import {userAPI} from "../../users/api";
import {invoicesAPI} from "../../invoices/api";
import React from "react";
import {machineryAPI} from "../../machinery/api";

const SHIPMENTS_TYPE_VALUES = ['air', 'railway'] as const;
const ORDER_TYPE_VALUES = ['current', 'planned', 'archived'] as const;

function normalizeEnum<T extends readonly string[]>(
    value: any,
    allowed: T,
    fallback: T[number]
): T[number] {
    return allowed.includes(value) ? (value as T[number]) : fallback;
}

function toIsoOrUndefined(ms?: any): string | undefined {
    const n = Number(ms);
    if (!Number.isFinite(n) || n <= 0) return undefined;
    const d = new Date(n);
    return isNaN(d.getTime()) ? undefined : d.toISOString();
}

function emptyToNull<T>(v: T | ''): T | null {
    return v === '' ? null : (v as any);
}

async function mapDocToNewOrderAsync(doc: any): Promise<INewOrder> {
    const data = doc.data() ?? {};
    // createdAt в Firestore часто в мс. Если нет — пропускаем поле.
    const created_at_iso = toIsoOrUndefined(data.createdAt);
    const shipments_type = normalizeEnum(
        data?.shipmentType,
        SHIPMENTS_TYPE_VALUES,
        'air' // выберите безопасный дефолт или маппите по правилам
    );
    const type = normalizeEnum(
        data?.orderType,
        ORDER_TYPE_VALUES,
        'current' // дефолт при миграции
    );
    return {
        ...emptyOrder,
        firebase_id: doc.id,
        title: data?.title || 'Без названия',
        shipments_type,
        type,
        is_approved: Boolean(data?.approved?.isApproved),
        approved_date: Number(data?.approved?.date ?? 0),
        approved_author_id: null, // замапьте при необходимости
        is_cancel: Boolean(data?.cancel?.isCancel ?? false),
        cancel_date: Number(data?.cancel?.date ?? 0),
        cancel_author_id: null,
        author_date: Number(data.author.dateCreating ?? 0),
        positions: Array.isArray(data.orderItems) ? data.orderItems.map((position: any) => ({
            // отправляйте только валидные поля, которые ждёт CreateOrderPositionDto
            name: String(position.name ?? ' '),
            catalog_number: String(position.catalogNumber ?? ' '),
            count: Number(position.count ?? 1),
            comment: position.comment ?? '',
            completion_type: position.completionType ?? null,
            invoice_id: position.invoiceId ?? null, // позже замапите в UUID
            is_ordered: !!position.invoiceId || !!position.completionType,
            unit_measure: "шт",
            // если DTO позволяет — оставьте firebase_id, иначе уберите:
            // firebase_id: position.firebase_id ?? undefined,
        })) : [],
        // Пустую строку превращаем в null, чтобы пройти @IsUUID|IsOptional
        machinery_id: emptyToNull(data.machineryId),
    };
}

const AOrderMigration = () => {
    const dispatch = useAppDispatch();
    const clickHandler = async () => {
        try {
            const qRef = query(collection(db, 'orders'));
            const snap = await getDocs(qRef);
            const orders: INewOrder[] = await Promise.all(
                snap.docs.map((d) => mapDocToNewOrderAsync(d))
            );
            const dispatchWithDelay = async (orders: INewOrder[], index = 0) => {
                if (index >= orders.length) return;
                // 1) Маппинг author/approved/cancel/machinery
                if (orders[index].author_id) {
                    try {
                        orders[index].author_id = await userAPI.getByFirebaseId(orders[index].author_id!);
                    } catch {
                    }
                }
                if (orders[index].approved_author_id) {
                    try {
                        orders[index].approved_author_id = await userAPI.getByFirebaseId(orders[index].approved_author_id!);
                    } catch {
                    }
                }
                if (orders[index].cancel_author_id) {
                    try {
                        orders[index].cancel_author_id = await userAPI.getByFirebaseId(orders[index].cancel_author_id!);
                    } catch {
                    }
                }
                if (orders[index].machinery_id) {
                    try {
                        orders[index].machinery_id = await machineryAPI.getByFirebaseId(orders[index].machinery_id!);
                    } catch {
                        orders[index].machinery_id = null;
                    }
                } else if (orders[index].machinery_id === '') {
                    orders[index].machinery_id = null;
                }
                // 2) Маппинг invoice_id в позициях
                const positionsList = orders[index].positions ?? [];
                if (positionsList.length > 0) {
                    try {
                        orders[index].positions = await Promise.all(
                            positionsList.map(async (p) => {
                                if (p.invoice_id) {
                                    const actualId = await invoicesAPI.getByFirebaseId(p.invoice_id);
                                    return {...p, invoice_id: actualId};
                                } else {
                                    return p;
                                }
                            })
                        );
                    } catch {
                    }
                }
                // 3) Формируем payload, убираем потенциально проблемные поля
                const order_in: Partial<INewOrder> = {
                    ...orders[index],
                };

                // Не отправляйте category, если не хотите — в БД есть default
                if (order_in.category === '-1') {
                    delete order_in.category;
                }
                await dispatch(fetchAddOrder(order_in as any /* CreateOrderDto */));
                setTimeout(() => {
                    dispatchWithDelay(orders, index + 1);
                }, 500);
            };
            await dispatchWithDelay(orders);
            console.log('Order migration complete. Count:', orders.length);
        } catch (e) {
            console.error('Order migration failed:', e);
        }
    };
    return (<Button onClick={clickHandler}>Мигрировать заявки</Button>);
};

export default AOrderMigration;
