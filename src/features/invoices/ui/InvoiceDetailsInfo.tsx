import React, { FC } from "react";
import { Stack } from "@mui/material";
import Divider from "@mui/material/Divider";
import TitleWithValue from "../../../components/TitleWithValue";
import {IInvoice} from "../../../models/iInvoices";

interface IProps {
  invoice: IInvoice;
}

const InvoiceDetailsInfo: FC<IProps> = ({ invoice }) => {
  return (
    <Stack spacing={2}>
      <TitleWithValue title={"№ :"} value={invoice.number} />
      <Divider />
      <TitleWithValue title={"Поставщик :"} value={invoice.supplier?.name} />
      <Divider />
      <TitleWithValue title={"ИНН :"} value={invoice.supplier?.INN} />
      <Divider />
      <TitleWithValue title={"Сумма :"} value={invoice.amount + " руб."} />
      <Divider />
      <TitleWithValue title={"НДС :"} value={invoice.is_with_vat ? "Да" : "Нет"} />
      <Divider />
   {/*   <TitleWithValue title={"Одобрен :"}>
        <ApprovedInvoiceCheckbox invoice={invoice} />
      </TitleWithValue>*/}
    </Stack>
  );
};

export default InvoiceDetailsInfo;
