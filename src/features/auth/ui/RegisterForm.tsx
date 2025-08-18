import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { Link } from "react-router-dom";
import { selectIsAuthLoading } from "../model/selectors";
import { useEditor } from "../../../hooks/useEditor";
import { registerValidate } from "../../../utils/validators";
import AuthLayout from "./AuthLayout";
import FieldControl from "../../../components/common/FieldControl";
import CompanyRegModule from "../../companies/ui/CompanyRegModule";
import LoadingButton from "@mui/lab/LoadingButton";
import { routes } from "../../../utils/routes";
import { useCallback, useEffect, useMemo } from "react";
import { fetchRegister } from "../model/actions";
import * as React from "react";
import { IRegisterData, registerValues } from "../../../models/iAuth";
import { fetchCheckCompanyById } from "../../companies/model/actions";
import { selectCurrentCompanyName } from "../../companies/model/selectors";
import UserView from "../../users/ui/UserView";

const RegisterForm = () => {
  const dispatch = useAppDispatch();
  const isAuthLoading = useAppSelector(selectIsAuthLoading);
  const companyName = useAppSelector(selectCurrentCompanyName) || "";
  const validateRegister = useCallback((values: IRegisterData) => registerValidate(values, companyName), [companyName]);
  const initialRegister = useMemo(() => ({ ...registerValues }), [registerValues]);
  const { setEditedValue, editedValue, errors, handleFieldChange } = useEditor<IRegisterData>({
    initialValue: initialRegister,
    validate: validateRegister,
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(fetchRegister(editedValue));
  };
  useEffect(() => {
    if (editedValue.company_id.length > 5) {
      dispatch(fetchCheckCompanyById(editedValue.company_id));
    }
  }, [editedValue.company_id]);
  return (
    <AuthLayout title="Регистрация" handleSubmit={handleSubmit}>
      <UserView userFieldChangeHandler={handleFieldChange} editedUser={editedValue} errors={errors} isEditMode={true} />
      <FieldControl
        label="Пароль"
        name="password"
        id="password"
        value={editedValue.password}
        error={errors?.password}
        onChange={handleFieldChange}
        isRequired
      />
      <CompanyRegModule
        onChange={handleFieldChange}
        errors={errors}
        setEditedValue={setEditedValue}
        editedValue={editedValue}
      />
      <LoadingButton
        loading={isAuthLoading}
        loadingIndicator="Загрузка…"
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={Object.keys(errors).length > 0}
      >
        Регистрация
      </LoadingButton>
      <Link to={routes.login}>{"Есть аккаунт? Войти"}</Link>
    </AuthLayout>
  );
};
export default RegisterForm;
