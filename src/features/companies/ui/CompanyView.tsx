import { ValidationErrors } from "../../../utils/validators";
import React, { ChangeEvent, FC } from "react";
import { SelectChangeEvent } from "@mui/material";
import FieldControl from "../../../components/common/FieldControl";
import { ICompany } from "../../../models/iCompanies";
import { ISupplier } from "../../../models/iSuppliers";

function isSupplier(company: ICompany | ISupplier): company is ISupplier {
  return "phone" in company;
}

interface IProps {
  editedCompany: ICompany | ISupplier;
  errors?: ValidationErrors;
  isEditMode?: boolean;
  userFieldChangeHandler: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string | unknown>,
  ) => void;
}

const CompanyView: FC<IProps> = ({ editedCompany, errors, userFieldChangeHandler, isEditMode = false }) => {
  if (!editedCompany) return null;
  return (
    <>
      <FieldControl
        label="Название"
        name="name"
        id="name"
        value={editedCompany.name}
        error={errors?.name}
        isEditMode={isEditMode}
        onChange={userFieldChangeHandler}
        isRequired
      />
      <FieldControl
        label="ИНН"
        name="INN"
        id="INN"
        value={editedCompany.INN}
        error={errors?.INN}
        isEditMode={isEditMode}
        onChange={userFieldChangeHandler}
      />
      <FieldControl
        label="КПП"
        name="kpp"
        id="kpp"
        value={editedCompany.kpp}
        error={errors?.kpp}
        isEditMode={isEditMode}
        onChange={userFieldChangeHandler}
      />
      <FieldControl
        label="Город"
        name="city"
        id="city"
        value={editedCompany.city}
        error={errors?.city}
        isEditMode={isEditMode}
        onChange={userFieldChangeHandler}
      />
      <FieldControl
        label="Юридический адрес"
        name="legal_address"
        id="legal_address"
        value={editedCompany.legal_address}
        error={errors?.legal_address}
        isEditMode={isEditMode}
        onChange={userFieldChangeHandler}
      />
      <FieldControl
        label="БИК"
        name="bik"
        id="bik"
        value={editedCompany.bik}
        error={errors?.bik}
        isEditMode={isEditMode}
        onChange={userFieldChangeHandler}
      />
      <FieldControl
        label="Кор. счёт"
        name="correspondent_account"
        id="correspondent_account"
        value={editedCompany.correspondent_account}
        error={errors?.correspondent_account}
        isEditMode={isEditMode}
        onChange={userFieldChangeHandler}
      />
      <FieldControl
        label="Расчётный счёт"
        name="payment_account"
        id="payment_account"
        value={editedCompany.payment_account}
        error={errors?.payment_account}
        isEditMode={isEditMode}
        onChange={userFieldChangeHandler}
      />
      <FieldControl
        label="Банк"
        name="bank"
        id="bank"
        value={editedCompany.bank}
        error={errors?.bank}
        isEditMode={isEditMode}
        onChange={userFieldChangeHandler}
      />
      <FieldControl
        label="ОКОГУ"
        name="okogu"
        id="okogu"
        value={editedCompany.okogu}
        error={errors?.okogu}
        isEditMode={isEditMode}
        onChange={userFieldChangeHandler}
      />
      <FieldControl
        label="ОГРН"
        name="ogrn"
        id="ogrn"
        value={editedCompany.ogrn}
        error={errors?.ogrn}
        isEditMode={isEditMode}
        onChange={userFieldChangeHandler}
      />
      <FieldControl
        label="ОКПО"
        name="okpo"
        id="okpo"
        value={editedCompany.okpo}
        error={errors?.okpo}
        isEditMode={isEditMode}
        onChange={userFieldChangeHandler}
      />
      <FieldControl
        label="ОКАТО"
        name="okato"
        id="okato"
        value={editedCompany.okato}
        error={errors?.okato}
        isEditMode={isEditMode}
        onChange={userFieldChangeHandler}
      />
      {isSupplier(editedCompany) && (
        <>
          <FieldControl
            label="Телефон"
            name="phone"
            id="phone"
            value={editedCompany.phone ?? ""}
            error={errors?.phone}
            onChange={userFieldChangeHandler}
            isEditMode={isEditMode}
          />
          <FieldControl
            label="Email менеджера"
            name="manager_email"
            id="manager_email"
            value={editedCompany.manager_email ?? ""}
            error={errors?.manager_email}
            onChange={userFieldChangeHandler}
            isEditMode={isEditMode}
          />
          <FieldControl
            label="Email бухгалтерии"
            name="accounts_department_email"
            id="accounts_department_email"
            value={editedCompany.accounts_department_email ?? ""}
            error={errors?.accounts_department_email}
            onChange={userFieldChangeHandler}
            isEditMode={isEditMode}
          />
        </>
      )}
    </>
  );
};
export default CompanyView;
