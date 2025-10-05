import React, {FC, ReactNode, useEffect} from 'react';
import {Stack} from "@mui/material";
import {useAppSelector} from "../../hooks/redux";
import {selectIsAuth, selectIsAuthChecked, selectIsAuthLoading} from "../../features/auth/model/selectors";
import {useNavigate} from "react-router-dom";
import Preloader from "../common/Preloader";

interface IProps {
    children?: ReactNode;
    /** Если true — доступ только для неавторизованных, иначе для всех */
    guestOnly?: boolean;
    /** Если true — доступ только для авторизованных, иначе для всех */
    authOnly?: boolean;
}

const PageTemplate: FC<IProps> = ({
                                      children,
                                      guestOnly = false,
                                      authOnly = false,
                                  }) => {
    const isAuth = useAppSelector(selectIsAuth);
    const isAuthLoading = useAppSelector(selectIsAuthLoading);
    const isAuthChecked = useAppSelector(selectIsAuthChecked);
    const navigate = useNavigate();
    useEffect(() => {
        if (!isAuthChecked) return;    // ← ждём завершения проверки
        if (guestOnly && isAuth) {
            navigate('/main', { replace: true });
        } else if (authOnly && !isAuth) {
            navigate('/login', { replace: true });
        }
    }, [guestOnly, authOnly, isAuth, isAuthChecked, navigate]);
    if (!isAuth && authOnly) return null;
    return (
        <Stack sx={{
            width: '100%',
            maxWidth: {sm: '100%', md: '1700px'},
        }}
               spacing={3}
               pt={1}
        >
            {children}
        </Stack>
    );
};

export default PageTemplate;