import React, { ChangeEvent, FC } from 'react';
import { SelectChangeEvent, Stack } from '@mui/material';
import Divider from '@mui/material/Divider';
import FieldControl from "../../../components/common/FieldControl";
import {INewSupplier, ISupplier} from "../../../models/iSuppliers";
import {ValidationErrors} from "../../../utils/validators";

interface IProps {
  supplier: INewSupplier | ISupplier | null;
  errors?: ValidationErrors;
  isEditMode?: boolean;
  fieldChangeHandler: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string | unknown>,
  ) => void;
}

const SupplierView: FC<IProps> = ({ supplier, errors, isEditMode = false, fieldChangeHandler }) => {
  if (!supplier) {
    return null;
  }
  return (
    <Stack spacing={isEditMode ? 1 : 4} sx={{ flexGrow: 1 }}>
      <FieldControl
        label="Название"
        name="name"
        id="name"
        value={supplier.name}
        isEditMode={isEditMode}
        onChange={fieldChangeHandler}
        error={errors?.name}
        isRequired
      />
      <Stack direction="row" spacing={1}>
        <FieldControl
          label="ИНН"
          name="INN"
          id="INN"
          value={supplier.INN}
          isEditMode={isEditMode}
          onChange={fieldChangeHandler}
          error={errors?.INN}
          isRequired
        />
        <FieldControl
          label="КПП"
          name="kpp"
          id="kpp"
          value={supplier.kpp || ''}
          isEditMode={isEditMode}
          onChange={fieldChangeHandler}
          error={errors?.kpp}
        />
      </Stack>
      {!isEditMode && <Divider flexItem sx={{ mx: 1 }} />}
      <Stack direction="row" spacing={1}>
        <FieldControl
          label="Город"
          name="city"
          id="city"
          value={supplier.city || ''}
          isEditMode={isEditMode}
          onChange={fieldChangeHandler}
          error={errors?.city}
        />
        <FieldControl
          label="Телефон"
          name="phone"
          id="phone"
          value={supplier.phone || ''}
          isEditMode={isEditMode}
          onChange={fieldChangeHandler}
          error={errors?.phone}
        />
      </Stack>
      <Stack direction="row" spacing={1}>
        <FieldControl
          label="Email менеджера"
          name="manager_email"
          id="manager_email"
          value={supplier.manager_email || ''}
          isEditMode={isEditMode}
          onChange={fieldChangeHandler}
          error={errors?.manager_email}
        />
        <FieldControl
          label="Email бухгалтерии"
          name="accounts_department_email"
          id="accounts_department_email"
          value={supplier.accounts_department_email || ''}
          isEditMode={isEditMode}
          onChange={fieldChangeHandler}
          error={errors?.accounts_department_email}
        />
      </Stack>
      <FieldControl
        label="Юридический адрес"
        name="legal_address"
        id="legal_address"
        value={supplier.legal_address || ''}
        isEditMode={isEditMode}
        onChange={fieldChangeHandler}
        error={errors?.Legal_address}
      />
      {!isEditMode && <Divider flexItem sx={{ mx: 1 }} />}
      <Stack direction="row" spacing={1}>
        <FieldControl
          label="Отделение банка"
          name="bank"
          id="bank"
          value={supplier.bank || ''}
          isEditMode={isEditMode}
          onChange={fieldChangeHandler}
          error={errors?.bank}
        />
        <FieldControl
          label="БИК"
          name="bik"
          id="bik"
          value={supplier.bik || ''}
          isEditMode={isEditMode}
          onChange={fieldChangeHandler}
          error={errors?.bik}
        />
      </Stack>
      <Stack direction="row" spacing={1}>
        <FieldControl
          label="Кор. счёт"
          name="correspondent_account"
          id="correspondent_account"
          value={supplier.correspondent_account || ''}
          isEditMode={isEditMode}
          onChange={fieldChangeHandler}
          error={errors?.correspondent_account}
        />
        <FieldControl
          label="Расчётный счёт"
          name="payment_account"
          id="payment_account"
          value={supplier.payment_account || ''}
          isEditMode={isEditMode}
          onChange={fieldChangeHandler}
          error={errors?.payment_account}
        />
      </Stack>
      <Stack direction="row" spacing={1}>
        <FieldControl
          label="ОГРН"
          name="ogrn"
          id="ogrn"
          value={supplier.ogrn || ''}
          isEditMode={isEditMode}
          onChange={fieldChangeHandler}
          error={errors?.ogrn}
        />
        <FieldControl
          label="ОКПО"
          name="okpo"
          id="okpo"
          value={supplier.okpo || ''}
          isEditMode={isEditMode}
          onChange={fieldChangeHandler}
          error={errors?.okpo}
        />
      </Stack>
      <Stack direction="row" spacing={1}>
        <FieldControl
          label="ОКАТО"
          name="okato"
          id="okato"
          value={supplier.okato || ''}
          isEditMode={isEditMode}
          onChange={fieldChangeHandler}
          error={errors?.okato}
        />
        <FieldControl
          label="ОКОГУ"
          name="okogu"
          id="okogu"
          value={supplier.okogu || ''}
          isEditMode={isEditMode}
          onChange={fieldChangeHandler}
          error={errors?.okogu}
        />
      </Stack>
    </Stack>
  );
};

export default SupplierView;
