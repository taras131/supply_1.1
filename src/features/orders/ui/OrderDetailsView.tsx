import React, {FC, useState} from 'react';
import OrderDetailsForm from "./OrderDetailsForm";
import OrderDetailsShow from "./OrderDetailsShow";
import {defaultOrder, IOrder} from "../../../models/iOrders";
import Card from "@mui/material/Card";
import ButtonsEditCancelSave from "../../../components/common/ButtonsEditCancelSave";
import {useAppDispatch} from "../../../hooks/redux";
import {fetchUpdateOrder} from "../model/actions";
import {useEditor} from "../../../hooks/useEditor";
import {orderValidate} from "../../../utils/validators";


interface IProps {
    order: IOrder,
}

const OrderDetailsView: FC<IProps> = ({order}) => {
    const [isEdit, setIsEdit] = useState(false);
    const dispatch = useAppDispatch();
    const { editedValue, handleFieldChange } = useEditor<IOrder>({
        initialValue: order ?? defaultOrder,
        validate: orderValidate,
    });
    const updateHandler = () => {
        dispatch(fetchUpdateOrder(editedValue));
    }
    const toggleIsBasicEditMode = () => {
        setIsEdit(prev => !prev)
    }
    return (
        <Card sx={{padding: "26px", position: "relative"}}>
            {isEdit
                ? (<OrderDetailsForm editedValue={editedValue}
                                     handleFieldChange={handleFieldChange}/>)
                : (<OrderDetailsShow order={order}/>)}
            <ButtonsEditCancelSave
                isEditMode={isEdit}
                isValid={true}
                cancelUpdateHandler={() => setIsEdit(false)}
                toggleIsEditMode={toggleIsBasicEditMode}
                updateHandler={updateHandler}
            />
        </Card>
    );
};

export default OrderDetailsView;