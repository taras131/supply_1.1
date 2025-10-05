import React, {FC, ReactNode, useEffect} from 'react';
import {Stack} from "@mui/material";
import {useAppSelector} from "../../hooks/redux";
import {selectIsAuth} from "../../features/auth/model/selectors";
import {useNavigate} from "react-router-dom";

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
    const navigate = useNavigate();
    useEffect(() => {
        if (guestOnly && isAuth) {
            // Защита для гостей: если уже авторизован, редирект на главную
            navigate('/main', {replace: true});
        } else if (authOnly && !isAuth) {
            // Защита для авторизованных: если не авторизован, редирект на логин
            navigate('/login', {replace: true});
        }
    }, [guestOnly, authOnly, isAuth, navigate]);
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