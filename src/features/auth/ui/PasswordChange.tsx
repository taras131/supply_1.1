import React from 'react';
import CardTemplate from "../../../components/templates/CardTemplate";
import MyFormControl from "../../../styles/theme/customizations/MyFormControl";
import {Stack} from "@mui/material";
import MyButton from "../../../styles/theme/customizations/MyButton";
import Box from "@mui/material/Box";
import {fetchChangePassword} from "../model/actions";
import {useAppDispatch} from "../../../hooks/redux";
import {setMessage} from "../../messages/model/slice";
import {MESSAGE_SEVERITY} from "../../../utils/const";

const PasswordChange = () => {
    const dispatch = useAppDispatch();
    const [passwordData, setPasswordData] = React.useState({
        oldPassword: "",
        newPassword: "",
        repeatNewPassword: "",
    });
    const [errors, setErrors] = React.useState({
        oldPassword: '',
        newPassword: '',
        repeatNewPassword: '',
    });
    const inputChangeHandler = (e: any) => {
        const {name, value} = e.target;
        setPasswordData(prev => ({...prev, [name]: value}));
        let newErrors = {...errors};

        if (name === 'oldPassword') {
            newErrors.oldPassword = value.length < 4
                ? 'Старый пароль должен быть не короче 4 символов'
                : '';
            // Проверяем, что новый пароль отличается от старого, если новый пароль уже заполнен
            if (passwordData.newPassword && passwordData.newPassword === value) {
                newErrors.newPassword = 'Новый пароль должен отличаться от старого';
            } else if (passwordData.newPassword && passwordData.newPassword !== value && passwordData.newPassword.length >= 4) {
                // Убираем ошибку, если новый пароль теперь отличается от старого
                if (newErrors.newPassword === 'Новый пароль должен отличаться от старого') {
                    newErrors.newPassword = '';
                }
            }
        } else if (name === 'newPassword') {
            // Проверяем длину нового пароля
            if (value.length < 4) {
                newErrors.newPassword = 'Новый пароль должен быть не короче 4 символов';
            }
            // Проверяем, что новый пароль отличается от старого
            else if (passwordData.oldPassword && value === passwordData.oldPassword) {
                newErrors.newPassword = 'Новый пароль должен отличаться от старого';
            } else {
                newErrors.newPassword = '';
            }

            // Также проверяем совпадение с повтором, если повтор уже заполнен
            if (passwordData.repeatNewPassword) {
                newErrors.repeatNewPassword = value !== passwordData.repeatNewPassword
                    ? 'Новые пароли должны совпадать'
                    : '';
            }
        } else if (name === 'repeatNewPassword') {
            newErrors.repeatNewPassword = value !== passwordData.newPassword
                ? 'Новые пароли должны совпадать'
                : '';
        }

        setErrors(newErrors);
    };

    const changeClickHandler = async () => {
        if (passwordData.newPassword) {
            const res = await dispatch(fetchChangePassword(passwordData))
            if (res && res.payload && res.payload.message) {
                dispatch(setMessage({
                    severity: MESSAGE_SEVERITY.success,
                    text: res.payload.message
                }))
            }
        }
    }
    return (
        <Box
            sx={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(500px, 100%), 1fr))",
                gap: "30px",
                marginTop: "18px",
            }}
        >
            <CardTemplate>
                <Stack spacing={4}>
                    <MyFormControl value={passwordData.oldPassword}
                                   changeHandler={inputChangeHandler}
                                   name={"oldPassword"}
                                   label={"старый пароль"}
                                   errorText={errors.oldPassword}/>
                    <MyFormControl value={passwordData.newPassword}
                                   changeHandler={inputChangeHandler}
                                   name={"newPassword"}
                                   label={"новый пароль"}
                                   errorText={errors.newPassword}/>
                    <MyFormControl value={passwordData.repeatNewPassword}
                                   changeHandler={inputChangeHandler}
                                   name={"repeatNewPassword"}
                                   label={"повторите новый пароль"}
                                   errorText={errors.repeatNewPassword}/>
                    <MyButton onClick={changeClickHandler}
                              color={"success"}
                              variant={"contained"}
                              disabled={!!errors.newPassword
                                  || !!errors.oldPassword
                                  || !!errors.repeatNewPassword
                                  || !passwordData.repeatNewPassword
                                  || !passwordData.oldPassword
                                  || !passwordData.newPassword}>
                        Заменить
                    </MyButton>
                </Stack>
            </CardTemplate>
        </Box>
    );
};

export default PasswordChange;