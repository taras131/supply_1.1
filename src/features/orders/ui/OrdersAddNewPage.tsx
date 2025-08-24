import React, {useCallback, useEffect, useId, useMemo} from "react";
import {Stack} from "@mui/material";
import Card from "@mui/material/Card";
import {useEditor} from "../../../hooks/useEditor";
import {orderValidate} from "../../../utils/validators";
import {emptyOrder, INewOrder, ordersTypes, shipmentTypes} from "../../../models/iOrders";
import FieldControl from "../../../components/common/FieldControl";
import {
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
} from "@mui/material";
import OrderPositionsTable from "../../orders_positions/ui/OrderPositionsTable";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {selectOrdersIsLoading} from "../model/selectors";
import {emptyOrderPosition, INewOrderPosition, IOrderPosition} from "../../../models/IOrdersPositions";
import {fetchAddOrder} from "../model/actions";
import {filesAPI} from "../../files/api";
import OrdersAddNewPageHeader from "./OrdersAddNewPageHeader";
import {useNavigate} from "react-router-dom";
import OrderDetailsForm from "./OrderDetailsForm";
import {fetchGetAllMachinery} from "../../machinery/model/actions";

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
    useEffect(() => {
        dispatch(fetchGetAllMachinery());
    }, []);
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
        async (file: File, orderPositionId: string) => {
            const photoName = await filesAPI.upload(file);
            setEditedValue(prev => ({
                ...prev,
                positions: prev.positions.map(p =>
                    `${p.id}` === orderPositionId
                        ? {...p, photos: [...(p.photos ?? []), photoName]}
                        : p
                ),
            }));
        },
        [setEditedValue]
    );
    const deletePhotoHandler = useCallback(
        async (deletePhoto: string, orderPositionId: string) => {
            await filesAPI.delete(deletePhoto);
            setEditedValue(prev => ({
                ...prev,
                positions: prev.positions.map(p =>
                    `${p.id}` === orderPositionId
                        ? {...p, photos: (p.photos ?? []).filter(photo => photo !== deletePhoto)}
                        : p
                ),
            }));

        },
        [setEditedValue]
    );
    const deletePositionHandler = useCallback(
        async (id: string) => {
            const pos = editedValue.positions.find(p => `${p.id}` === id);
            if (pos && pos.photos) {
                for (const photo of pos.photos) {
                    try {
                        await filesAPI.delete(photo);
                    } catch (e) {
                        console.warn("Failed to delete photo:", photo, e);
                    }
                }
            }
            setEditedValue(prev => ({
                ...prev,
                positions: prev.positions.filter(p => `${p.id}` !== id),
            }));
        },
        [editedValue.positions, setEditedValue]
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
        <Stack sx={{
            width: '100%',
            maxWidth: {sm: '100%', md: '1700px'},
            pt: 1.5,
        }}
               spacing={3}>
            <OrdersAddNewPageHeader saveClickHandler={saveClickHandler}
                                    resetOrder={resetOrder}
                                    isLoading={isLoading}/>
            <Card sx={{padding: "16px"}}>
                <OrderDetailsForm editedValue={editedValue}
                                  handleFieldChange={handleFieldChange}/>
            </Card>
            <OrderPositionsTable
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
            />
        </Stack>
    );
};

export default OrdersAddNewPage;
