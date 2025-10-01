import React, {FC} from "react";
import {useAppDispatch} from "../../../hooks/redux";
import {fetchOut} from "../model/actions";
import PageHeaderTemplate from "../../../components/templates/PageHeaderTemplate";
import MyButton from "../../../styles/theme/customizations/MyButton";

const ProfileHeader: FC = () => {
    const dispatch = useAppDispatch();
    const handleOutClick = () => {
        dispatch(fetchOut());
    };
    return (
        <PageHeaderTemplate title={" Профиль:"}>
            <MyButton onClick={handleOutClick} variant={"outlined"}
                      sx={{color: 'text.primary'}}>
                Выход
            </MyButton>
        </PageHeaderTemplate>
    );
};

export default ProfileHeader;
