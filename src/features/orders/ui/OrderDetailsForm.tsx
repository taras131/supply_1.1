import React, {FC, useId} from 'react';
import {
    FormControl,
    FormControlLabel,
    FormLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    SelectChangeEvent,
    Stack
} from "@mui/material";
import {INewOrder, IOrder, orderCategories, ordersTypes, shipmentTypes} from "../../../models/iOrders";
import {useAppSelector} from "../../../hooks/redux";
import {selectAllMachineryForOptions} from "../../machinery/model/selectors";

interface IProps {
    editedValue: INewOrder | IOrder,
    isNewOrder?: boolean;
    handleFieldChange: (e: React.ChangeEvent<HTMLInputElement>
        | SelectChangeEvent<string | unknown>) => void,
}

const OrderDetailsForm: FC<IProps> = ({editedValue, isNewOrder, handleFieldChange}) => {
    const shipmentTypeRadioId = useId();
    const orderTypeRadioId = useId();
    const categorySelectId = useId();
    const machinerySelectId = useId();
    const machinery = useAppSelector(selectAllMachineryForOptions)
    return (
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
            <FormControl sx={{width: '200px'}}>
                <FormLabel id={categorySelectId}>Категория:</FormLabel>
                <Select name={"category"}
                        value={editedValue.category}
                        onChange={handleFieldChange}
                        aria-labelledby={categorySelectId}
                        variant={"standard"}>
                    {orderCategories.map(category => (
                        <MenuItem value={category}>{category}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl sx={{width: '200px'}}>
                <FormLabel id={machinerySelectId}>Техника:</FormLabel>
                <Select name={"machinery_id"}
                        value={editedValue.machinery_id}
                        onChange={handleFieldChange}
                        aria-labelledby={machinerySelectId}
                        variant={"standard"}>
                    <MenuItem value={"-1"}>Не выбрано</MenuItem>
                    {machinery.map(machinery => (
                        <MenuItem value={machinery.id}>{machinery.title}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Stack>
    );
};

export default OrderDetailsForm;