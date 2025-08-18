import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { Link } from "react-router-dom";
import { useEditor } from "../../../hooks/useEditor";
import { routes } from "../../../utils/routes";
import FieldControl from "../../../components/common/FieldControl";
import LoadingButton from "@mui/lab/LoadingButton";
import AuthLayout from "./AuthLayout";
import { fetchLogin } from "../model/actions";
import { loginValidate } from "../../../utils/validators";
import { ILoginData, loginValues } from "../../../models/iAuth";
import { FormEvent, useCallback, useMemo } from "react";
import { selectIsAuthLoading } from "../model/selectors";

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsAuthLoading);
  const validateLogin = useCallback((values: ILoginData) => loginValidate(values), []);
  const initialLogin = useMemo(() => ({ ...loginValues }), [loginValues]);
  const { editedValue, errors, handleFieldChange, resetValue } = useEditor<ILoginData>({
    initialValue: initialLogin,
    validate: validateLogin,
  });
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(fetchLogin({ email: editedValue.email, password: editedValue.password }));
    resetValue();
  };
  return (
    <AuthLayout title="Вход" handleSubmit={handleSubmit}>
      <FieldControl
        label="Email"
        name="email"
        id="email"
        value={editedValue.email}
        error={errors?.email}
        onChange={handleFieldChange}
        isRequired
      />
      <FieldControl
        label="Пароль"
        name="password"
        id="password"
        value={editedValue.password}
        error={errors?.password}
        onChange={handleFieldChange}
        isRequired
      />
      <LoadingButton
        sx={{ marginTop: "16px" }}
        loading={isLoading}
        loadingIndicator="Загрузка…"
        type="submit"
        fullWidth
        variant="contained"
        disabled={Object.keys(errors).length > 0}
      >
        Войти
      </LoadingButton>
      <Link to={routes.register}>{"Нет аккаунта? Зарегистрироваться"}</Link>
    </AuthLayout>
  );
};
export default LoginForm;
