import React, { FC, useState } from "react";
import ButtonsEditCancelSave from "../../../components/common/ButtonsEditCancelSave";
import { Typography } from "@mui/material";
import { defaultCompany, ICompany } from "../../../models/iCompanies";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { useEditor } from "../../../hooks/useEditor";
import { companyValidate } from "../../../utils/validators";
import { fetchUpdateCompany } from "../model/actions";
import CompanyView from "./CompanyView";
import { selectCurrentUserEmail } from "../../users/model/selectors";
import ViewCardPattern from "../../../components/common/ViewCardPattern";

interface IProps {
  company: ICompany;
}

const CompanyDetails: FC<IProps> = ({ company }) => {
  const dispatch = useAppDispatch();
  const currentUserEmail = useAppSelector(selectCurrentUserEmail);
  const [isEditMode, setIsEditMode] = useState(false);
  const toggleIsEditMode = () => {
    setIsEditMode((prev) => !prev);
  };
  const { editedValue, errors, setEditedValue, handleFieldChange } = useEditor<ICompany>({
    initialValue: company ?? defaultCompany,
    validate: companyValidate,
  });
  const updateCompanyHandler = () => {
    if (editedValue) {
      toggleIsEditMode();
      dispatch(fetchUpdateCompany(editedValue));
    }
  };
  const cancelUpdateCompanyHandler = () => {
    toggleIsEditMode();
    setEditedValue(company);
  };
  return (
    <ViewCardPattern isEditMode={isEditMode}>
      <CompanyView
        editedCompany={editedValue}
        isEditMode={isEditMode}
        errors={errors}
        userFieldChangeHandler={handleFieldChange}
      />

      {company.owner_email === currentUserEmail && (
        <ButtonsEditCancelSave
          isEditMode={isEditMode}
          isValid={!Object.keys(errors).length}
          toggleIsEditMode={toggleIsEditMode}
          updateHandler={updateCompanyHandler}
          cancelUpdateHandler={cancelUpdateCompanyHandler}
        />
      )}
      {!isEditMode && (
        <>
          <Typography variant={"subtitle2"} mt={2}>
            Вы можете отредактировать данные компании если являетесь её создателем.
          </Typography>
          <Typography variant={"subtitle2"} mt={1}>
            Ключ для регистрации сотрудников: {company.id}
          </Typography>
        </>
      )}
    </ViewCardPattern>
  );
};

export default CompanyDetails;
