import React, {useCallback, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {useParams} from "react-router-dom";
import {fetchGetOrderById, fetchUpdateOrder} from "../model/actions";
import {Stack} from "@mui/material";
import OrderPositionsTable from "../../orders_positions/ui/OrderPositionsTable";
import {selectAllOrdersPositions, selectOrdersPositionsIsLoading} from "../../orders_positions/model/selectors";
import {
    fetchCreateOrdersPositions, fetchDeleteOrdersPositionPhoto, fetchDeleteOrdersPositions,
    fetchUpdateOrdersPositions,
    fetchUploadOrdersPositionsPhoto, IPositionDeletePhotoData, IPositionUploadPhotoData
} from "../../orders_positions/model/actions";
import {emptyOrderPosition, INewOrderPosition, IOrderPosition} from "../../../models/IOrdersPositions";
import OrderDetailsPageHeader from "./OrderDetailsPageHeader";
import {selectCurrentOrder} from "../model/selectors";
import OrderDetailsView from "./OrderDetailsView";

const OrderDetailsPage = () => {
    const dispatch = useAppDispatch();
    const orderId = useParams().orderId || "0";
    const order = useAppSelector(selectCurrentOrder)
    const positions = useAppSelector(selectAllOrdersPositions)
    const isLoading = useAppSelector(selectOrdersPositionsIsLoading)
    useEffect(() => {
        if (orderId) {
            dispatch(fetchGetOrderById(orderId));
        }
    }, [dispatch, orderId]);
    const handlePositionsChange = useCallback(
        (newRow: INewOrderPosition | IOrderPosition) => {
            dispatch(fetchUpdateOrdersPositions(newRow))
        },
        [dispatch]
    );
    const handleAddRow = () => {
        dispatch(fetchCreateOrdersPositions({...emptyOrderPosition, order_id: orderId}))
    }
    const addPhotoHandler = (file: File, orderPositionId: string) => {
        const data_in: IPositionUploadPhotoData = {file, orderPositionId}
        dispatch(fetchUploadOrdersPositionsPhoto(data_in))
    }
    const deletePhotoHandler = (deletePhotoName: string, orderPositionId: string) => {
        const data_in: IPositionDeletePhotoData = {deletePhotoName, orderPositionId}
        dispatch(fetchDeleteOrdersPositionPhoto(data_in))
    }
    const commentChangeHandler = (newValue: string | number, orderPositionId: string) => {
        if (!positions) return
        const position = positions.filter(p => `${p.id}` === orderPositionId)[0]
        if (position) {
            dispatch(fetchUpdateOrdersPositions({...position, comment: `${newValue}`}))
        }
    }
    const deletePositionHandler = (id: string) => {
        dispatch(fetchDeleteOrdersPositions(id));
    }
    const titleChangeHandler = (newValue: string | number) => {
        if (order) {
            dispatch(fetchUpdateOrder({...order, title: `${newValue}`}))
        }
    };
    return (
        <Stack sx={{
            width: '100%',
            maxWidth: {sm: '100%', md: '1700px'},
            pt: 1.5,
        }}
               spacing={2}>
            <OrderDetailsPageHeader/>
            {order && (
                <OrderDetailsView order={order}/>
            )}
            <OrderPositionsTable
                orderId={order?.id || "-1"}
                rows={positions}
                onRowsChange={handlePositionsChange}
                loading={isLoading}
                handleAddRow={handleAddRow}
                addPhotoHandler={addPhotoHandler}
                deletePhotoHandler={deletePhotoHandler}
                commentChangeHandler={commentChangeHandler}
                deletePositionHandler={deletePositionHandler}
                title={order?.title || ""}
                titleChangeHandler={titleChangeHandler}
            />
        </Stack>
    );
};

export default OrderDetailsPage;
