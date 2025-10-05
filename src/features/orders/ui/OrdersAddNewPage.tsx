import React, {useCallback, useEffect, useMemo} from "react";
import Card from "@mui/material/Card";
import {useEditor} from "../../../hooks/useEditor";
import {orderValidate} from "../../../utils/validators";
import {emptyOrder, INewOrder} from "../../../models/iOrders";
import OrderPositionsTable from "../../orders_positions/ui/OrderPositionsTable";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {selectOrdersIsLoading} from "../model/selectors";
import {emptyOrderPosition, INewOrderPosition, IOrderPosition} from "../../../models/IOrdersPositions";
import {fetchAddOrder} from "../model/actions";
import {filesAPI} from "../../files/api";
import OrdersAddNewPageHeader from "./OrdersAddNewPageHeader";
import {useNavigate} from "react-router-dom";
import OrderDetailsForm from "./OrderDetailsForm";
import PageTemplate from "../../../components/templates/PageTemplate";
import {setIsOrderPositionLoading} from "../../orders_positions/model/slice";

const LOCAL_STORAGE_NEW_ORDER_KEY = "new_order"

const OrdersAddNewPage = () => {
    const isFirst = React.useRef(true);
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    const isLoading = useAppSelector(selectOrdersIsLoading)
    const memoizedInitialValue = useMemo(() => JSON.parse(JSON.stringify(emptyOrder)),
        []);
    const {editedValue, errors, handleFieldChange, resetValue, setEditedValue} = useEditor<INewOrder>({
        initialValue: memoizedInitialValue,
        validate: orderValidate,
    });
    const handlePositionsChange = useCallback(
        (newRow: INewOrderPosition | IOrderPosition) => {
            setEditedValue(prev => ({
                ...prev, positions:
                    [...prev.positions.map(position => position.id === newRow.id ? newRow : position)]
            }))
        },
        [setEditedValue]
    );
    useEffect(() => {
        if (isFirst.current) {
            isFirst.current = false;
            const raw = localStorage.getItem(LOCAL_STORAGE_NEW_ORDER_KEY);
            if (raw) {
                try {
                    setEditedValue(JSON.parse(raw));
                } catch {
                }
            }
            return;
        }
        const t = setTimeout(() => {
            localStorage.setItem(LOCAL_STORAGE_NEW_ORDER_KEY, JSON.stringify(editedValue));
        }, 300);
        return () => clearTimeout(t);
    }, [editedValue, setEditedValue]);
    const getNextId = React.useCallback(() => {
        if (!editedValue.positions.length) return 1;
        const nums = editedValue.positions
            .map(r => (Number(r.id)))
            .filter(n => Number.isFinite(n));
        return nums.length ? Math.max(...nums) + 1 : Date.now();
    }, [editedValue.positions]);
    const commentChangeHandler = useCallback(
        (newValue: string | number, orderPositionId: string) => {
            setEditedValue(prev => ({
                ...prev,
                positions: prev.positions.map(p =>
                    `${p.id}` === orderPositionId ? {...p, comment: String(newValue)} : p
                ),
            }));
        },
        [setEditedValue]
    );
    const addPhotoHandler = useCallback(
        async (files: FileList, orderPositionId: string) => {
            dispatch(setIsOrderPositionLoading(true));
            const fileNames = await Promise.all(Array.from(files).map(f => filesAPI.upload(f)));
            const targetId = Number(orderPositionId);

            setEditedValue(prev => ({
                ...prev,
                positions: prev.positions.map(p =>
                    p.id === targetId
                        ? { ...p, photos: [...(p.photos ?? []), ...fileNames] }
                        : p
                ),
            }));

            dispatch(setIsOrderPositionLoading(false));
        },
        [dispatch, setEditedValue]
    );
    const deletePhotoHandler = useCallback(
        async (deletePhoto: string, orderPositionId: string) => {
            await filesAPI.delete(deletePhoto);
            setEditedValue(prev => ({
                ...prev,
                positions: prev.positions.map(p =>
                    `${p.id}` === `${orderPositionId}`
                        ? {...p, photos: (p.photos ?? []).filter(photo => photo !== deletePhoto)}
                        : p
                ),
            }));
        },
        [setEditedValue]
    );
    const deletePositionHandler = useCallback(
        (id: string) => {
            setEditedValue(prev => {
                // удаляем файлы синхронно в фоне
                prev.positions
                    .find(p => `${p.id}` === id)
                    ?.photos?.forEach(photo =>
                    filesAPI.delete(photo).catch(e => console.warn("Failed to delete photo:", photo, e))
                );

                return {
                    ...prev,
                    positions: prev.positions.filter(p => `${p.id}` !== id),
                };
            });
        },
        [setEditedValue]
    );
    const handleAddRow = () => {
        setEditedValue(prev => ({...prev, positions: [...prev.positions, {...emptyOrderPosition, id: getNextId()}]}));
    }
    const resetOrder = async () => {
        const positions = editedValue.positions
        if (positions.length > 0) {
            for (const position of positions) {
                if (position.photos.length > 0) {
                    for (const photo of position.photos) {
                        try {
                            await filesAPI.delete(photo);
                        } catch (e) {
                            console.warn("Failed to delete photo:", photo, e);
                        }
                    }
                }
            }
        }
        resetValue();
        localStorage.removeItem(LOCAL_STORAGE_NEW_ORDER_KEY);
    }
    const titleChangeHandler = (newValue: string | number) => {
        setEditedValue(prev => ({...prev, title: `${newValue}`}))
    }
    const saveClickHandler = async () => {
        try {
            await dispatch(fetchAddOrder(editedValue)).unwrap();
            localStorage.removeItem(LOCAL_STORAGE_NEW_ORDER_KEY);
            resetValue();
            navigate(-1);
        } catch (err: any) {

        }
    };
    return (
        <PageTemplate authOnly>
            <OrdersAddNewPageHeader saveClickHandler={saveClickHandler}
                                    resetOrder={resetOrder}
                                    isLoading={isLoading}
                                    setEditedValue={setEditedValue}
                                    errors={errors}/>
            <Card sx={{padding: "24px"}}>
                <OrderDetailsForm editedValue={editedValue}
                                  handleFieldChange={handleFieldChange}/>
            </Card>
            <OrderPositionsTable
                orderId={"-1"}
                rows={editedValue.positions}
                onRowsChange={handlePositionsChange}
                loading={isLoading}
                handleAddRow={handleAddRow}
                addPhotoHandler={addPhotoHandler}
                deletePhotoHandler={deletePhotoHandler}
                commentChangeHandler={commentChangeHandler}
                deletePositionHandler={deletePositionHandler}
                titleChangeHandler={titleChangeHandler}
                title={editedValue.title}
                isNewOrder
            />
        </PageTemplate>
    );
};

export default OrdersAddNewPage;
