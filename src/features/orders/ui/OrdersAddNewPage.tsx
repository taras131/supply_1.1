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
import {useAppSelector} from "../../../hooks/redux";
import {selectOrdersIsLoading} from "../model/selectors";
import {emptyOrderPosition, INewOrderPosition} from "../../../models/IOrdersPositions";

const OrdersAddNewPage = () => {
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
        (newRows: INewOrderPosition[]) => {
            // Если handleFieldChange принимает event-подобный объект:
            handleFieldChange({
                target: {name: 'positions', value: newRows},
            } as any);
        },
        [handleFieldChange]
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
    return (
        <Stack spacing={4} sx={{width: '100%'}}>
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
                                 handleAddRow={handleAddRow}/>
        </Stack>
    );
};

export default OrdersAddNewPage;
