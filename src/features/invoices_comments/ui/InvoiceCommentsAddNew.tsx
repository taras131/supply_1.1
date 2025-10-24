import React, {useMemo} from 'react';
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {commentValidate} from "../../../utils/validators";
import {useEditor} from "../../../hooks/useEditor";
import CommentsAddNew from "../../../components/comments/CommentsAddNew";
import {selectCurrentInvoiceId} from "../../invoices/model/selectors";
import {emptyInvoiceComment, INewInvoiceComment} from "../../../models/iInvoiceComment";
import {fetchAddInvoiceComment} from "../model/actions";

const InvoiceCommentsAddNew = () => {
    const dispatch = useAppDispatch();
    const invoiceId = useAppSelector(selectCurrentInvoiceId);
    const memoizedInitialValue = useMemo(
        () => JSON.parse(JSON.stringify(emptyInvoiceComment)),
        []
    );
    const validate = useMemo(() => commentValidate(), []);
    const {editedValue, errors, handleFieldChange, resetValue} = useEditor<INewInvoiceComment>({
        initialValue: memoizedInitialValue,
        validate: validate,
    });
    const saveClickHandler = () => {
        dispatch(
            fetchAddInvoiceComment({
                ...editedValue,
                invoice_id: invoiceId ? invoiceId : "-1",
            }),
        );
        resetValue();
    };
    return (
        <CommentsAddNew editedValue={editedValue}
                        errors={errors}
                        handleFieldChange={handleFieldChange}
                        saveClickHandler={saveClickHandler}/>

    );
};

export default InvoiceCommentsAddNew;