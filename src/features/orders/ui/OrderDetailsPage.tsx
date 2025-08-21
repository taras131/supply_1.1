import React, {useCallback, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {useParams} from "react-router-dom";
import {fetchGetOrderById} from "../model/actions";
import {Stack} from "@mui/material";
import OrderPositionsTable from "../../orders_positions/ui/OrderPositionsTable";
import {selectAllOrdersPositions, selectOrdersPositionsIsLoading} from "../../orders_positions/model/selectors";
import {
    fetchCreateOrdersPositions,
    fetchUpdateOrdersPositions,
    fetchUploadOrdersPositionsPhoto
} from "../../orders_positions/model/actions";
import {emptyOrderPosition, INewOrderPosition, IOrderPosition} from "../../../models/IOrdersPositions";
import OrderDetailsPageHeader from "./OrderDetailsPageHeader";

const OrderDetailsPage = () => {
    const dispatch = useAppDispatch();
    const orderId = useParams().orderId || "0";
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
        dispatch(fetchUploadOrdersPositionsPhoto({file, orderPositionId}))
    }
    return (
        <Stack spacing={4}
               sx={{
                   width: '100%',
                   maxWidth: {sm: '100%', md: '1700px'},
                   pt: 1.5,
               }}>
            <OrderDetailsPageHeader/>
            <OrderPositionsTable rows={positions}
                                 onRowsChange={handlePositionsChange}
                                 loading={isLoading}
                                 handleAddRow={handleAddRow}
                                 addPhotoHandler={addPhotoHandler}
            />
        </Stack>
    );
};

export default OrderDetailsPage;
