import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {Link, useParams} from "react-router-dom";
import {fetchGetOrderById} from "../model/actions";
import {Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {routes} from "../../../utils/routes";
import AddIcon from "@mui/icons-material/Add";
import OrderPositionsTable from "../../orders_positions/ui/OrderPositionsTable";
import {selectAllOrdersPositions, selectOrdersPositionsIsLoading} from "../../orders_positions/model/selectors";

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
    const handlePositionsChange = () => {
        console.log("handlePositionsChange")
    }
    const handleAddRow = () => {
        console.log("handleAddRow")
    }
    return (
        <Stack spacing={4} sx={{width: "100%"}}>
            <Stack direction="row" spacing={3} justifyContent="space-between" alignItems="center" sx={{mb: 2, mt: 2}}>
                <Typography component="h2" variant="h6">
                    Заявка
                </Typography>
                <div>
                    <Button>
                        Редактировать
                    </Button>
                </div>
            </Stack>
            <OrderPositionsTable rows={positions}
                                 onRowsChange={handlePositionsChange}
                                 loading={isLoading}
                                 handleAddRow={handleAddRow}
            />
        </Stack>
    );
};

export default OrderDetailsPage;
