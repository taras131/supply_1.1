import React, {ChangeEventHandler, FC} from 'react';
import {IInvoice} from "../../../models/iInvoices";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {Button} from "@mui/material";
import {LABEL} from "../../../styles/const";
import CachedIcon from "@mui/icons-material/Cached";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import {FILE_TYPE} from "../../../utils/const";
import {selectInvoicesIsLoading} from "../model/selectors";
import {fetchUploadInvoice} from "../model/actions";

interface IProps {
    invoice: IInvoice | null;
    forDetailsMode?: boolean;
}

const UploadInvoice: FC<IProps> = ({invoice, forDetailsMode = false}) => {
    const dispatch = useAppDispatch();
    const isLoading = useAppSelector(selectInvoicesIsLoading);
    const invoiceChangeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
        const file = e.currentTarget.files?.[0] ?? null;
        if (file && invoice) {
            dispatch(fetchUploadInvoice({invoice: invoice, file: file}))
        }
    }
    return (
        <Button
            sx={{textTransform: 'none', width: "160px"}}
            component={LABEL}
            loading={isLoading}
            variant={"contained"}
            fullWidth
            disabled={invoice?.cancel_is_cancel}
            color={invoice?.invoice_file_link ? "warning" : "primary"}
            startIcon={invoice?.invoice_file_link
                ? <CachedIcon/>
                : <FileUploadIcon/>}
        >
            {invoice?.invoice_file_link ? "Заменить счёт" : "Загрузить счёт"}
            <input type={FILE_TYPE}
                   hidden
                   onChange={invoiceChangeHandler}/>
        </Button>
    );
};

export default UploadInvoice;