import React, {useCallback, useId, useMemo} from "react";
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
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {Link} from "react-router-dom";
import {routes} from "../../../utils/routes";
import AddIcon from "@mui/icons-material/Add";
import {fetchAddOrder} from "../model/actions";

const OrdersAddNewPage = () => {
    const dispatch = useAppDispatch()
    const shipmentTypeRadioId = useId();
    const orderTypeRadioId = useId();
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
    const getNextId = React.useCallback(() => {
        if (!editedValue.positions.length) return 1;
        const nums = editedValue.positions
            .map(r => (Number(r.id)))
            .filter(n => Number.isFinite(n));
        return nums.length ? Math.max(...nums) + 1 : Date.now();
    }, [editedValue.positions]);
    const handleAddRow = () => {
        setEditedValue(prev => ({...prev, positions: [...prev.positions, {...emptyOrderPosition, id: getNextId()}]}));
    }
    const saveClickHandler = () => {
        dispatch(fetchAddOrder(editedValue));
    }
    return (
        <Stack spacing={4} sx={{width: '100%'}}>
            <Stack direction="row" spacing={3} justifyContent="space-between" alignItems="center" sx={{mb: 2, mt: 2}}>
                <Typography component="h2" variant="h6">
                    Новая заявка
                </Typography>
                <div>
                    <Button
                        onClick={saveClickHandler}
                        startIcon={<AddIcon sx={{fontSize: "var(--icon-fontSize-md)"}}/>}
                        variant="contained"
                    >
                        Сохранить
                    </Button>
                </div>
            </Stack>
            <Card sx={{p: 4}}>
                <Stack spacing={2}>
                    <FieldControl
                        label="Название заявки"
                        name="title"
                        id="title"
                        value={editedValue.title}
                        error={errors?.title}
                        isEditMode={true}
                        onChange={handleFieldChange}
                        isRequired
                    />
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                        <FormControl>
                            <FormLabel id={shipmentTypeRadioId}>Срочность:</FormLabel>
                            <RadioGroup
                                name={"shipments_type"}
                                row
                                aria-labelledby={shipmentTypeRadioId}
                                value={editedValue.shipments_type}
                                onChange={handleFieldChange}
                            >
                                <FormControlLabel value={shipmentTypes[0].name} control={<Radio/>}
                                                  label={shipmentTypes[0].value}/>
                                <FormControlLabel value={shipmentTypes[1].name} control={<Radio/>}
                                                  label={shipmentTypes[1].value}/>
                            </RadioGroup>
                        </FormControl>
                        <FormControl>
                            <FormLabel id={orderTypeRadioId}>Тип заявки:</FormLabel>
                            <RadioGroup
                                row
                                name={"type"}
                                aria-labelledby={orderTypeRadioId}
                                value={editedValue.type}
                                onChange={handleFieldChange}
                            >
                                <FormControlLabel value={ordersTypes[1].name} control={<Radio/>}
                                                  label={ordersTypes[1].value}/>
                                <FormControlLabel value={ordersTypes[0].name} control={<Radio/>}
                                                  label={ordersTypes[0].value}/>
                            </RadioGroup>
                        </FormControl>
                    </Stack>
                </Stack>
            </Card>
            <OrderPositionsTable rows={editedValue.positions}
                                 onRowsChange={handlePositionsChange}
                                 loading={isLoading}
                                 handleAddRow={handleAddRow}
            />
        </Stack>
    );
};

export default OrdersAddNewPage;
