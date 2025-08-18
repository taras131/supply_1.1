import { ValidationErrors } from "../../../utils/validators";
import React, { ChangeEvent, FC } from "react";
import { SelectChangeEvent } from "@mui/material";
import FieldControl from "../../../components/common/FieldControl";
import { IUserWithPassport, userRoles, userStatus } from "../../../models/IUser";
import { IRegisterData } from "../../../models/iAuth";

function isUserWithPassport(user: IUserWithPassport | IRegisterData): user is IUserWithPassport {
  return "passport_series" in user;
}

interface IProps {
  editedUser: IUserWithPassport | IRegisterData;
  errors?: ValidationErrors;
  isEditMode?: boolean;
  userFieldChangeHandler: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string | unknown>,
  ) => void;
}

const UserView: FC<IProps> = ({ editedUser, errors, userFieldChangeHandler, isEditMode = false }) => {
  if (!editedUser) return null;
  return (
    <>
      <FieldControl
        label="Имя"
        name="first_name"
        id="first_name"
        value={editedUser.first_name}
        error={errors?.first_name}
        isEditMode={isEditMode}
        onChange={userFieldChangeHandler}
        isRequired
      />
      <FieldControl
        label="Отчество"
        name="middle_name"
        id="middle_name"
        value={editedUser.middle_name}
        error={errors?.middle_name}
        isEditMode={isEditMode}
        onChange={userFieldChangeHandler}
        isRequired
      />
      <FieldControl
        label="Email"
        name="email"
        id="email"
        value={editedUser.email}
        error={errors?.email}
        isEditMode={isEditMode}
        onChange={userFieldChangeHandler}
        isRequired
      />
      <FieldControl
        label="Телеграм"
        name="telegram"
        id="telegram"
        value={editedUser.telegram}
        error={errors?.telegram}
        isEditMode={isEditMode}
        onChange={userFieldChangeHandler}
      />
      <FieldControl
        label="Телефон"
        name="phone"
        id="phone"
        value={editedUser.phone}
        error={errors?.phone}
        isEditMode={isEditMode}
        onChange={userFieldChangeHandler}
      />
      <FieldControl
        label="Должность"
        name="role_id"
        id="role_id"
        value={editedUser.role_id}
        error={errors?.role_id}
        onChange={userFieldChangeHandler}
        isEditMode={isEditMode}
        options={userRoles}
      />
      {isUserWithPassport(editedUser) && (
        <>
          <FieldControl
            label="Серия паспорта"
            name="passport_series"
            id="passport_series"
            value={editedUser.passport_series ?? ""}
            error={errors?.passport_series}
            onChange={userFieldChangeHandler}
            isEditMode={isEditMode}
          />
          <FieldControl
            label="Номер паспорта"
            name="passport_number"
            id="passport_number"
            value={editedUser.passport_number ?? ""}
            error={errors?.passport_number}
            onChange={userFieldChangeHandler}
            isEditMode={isEditMode}
          />
          <FieldControl
            label="Дата выдачи"
            name="passport_issued_date"
            id="passport_issued_date"
            value={editedUser.passport_issued_date ?? ""}
            error={errors?.passport_issued_date}
            onChange={userFieldChangeHandler}
            isEditMode={isEditMode}
          />
          <FieldControl
            label="Кем выдан"
            name="passport_issued_whom"
            id="passport_issued_whom"
            value={editedUser.passport_issued_whom ?? ""}
            error={errors?.passport_issued_whom}
            onChange={userFieldChangeHandler}
            isEditMode={isEditMode}
          />
          <FieldControl
            label="Статус"
            name="status_id"
            id="status_id"
            value={editedUser.status_id}
            error={errors?.status_id}
            onChange={userFieldChangeHandler}
            isEditMode={isEditMode}
            options={userStatus}
          />
        </>
      )}
    </>
  );
};
export default UserView;
