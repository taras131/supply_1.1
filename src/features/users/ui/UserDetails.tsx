import React, {FC, useEffect, useState} from "react";
import UserView from "./UserView";
import {useEditor} from "../../../hooks/useEditor";
import {defaultUser, IUser, IUserWithPassport} from "../../../models/IUser";
import {userUpdateValidate} from "../../../utils/validators";
import {useAppDispatch} from "../../../hooks/redux";
import {fetchUpdateUser} from "../model/actions";
import ButtonsEditCancelSave from "../../../components/common/ButtonsEditCancelSave";
import CardTemplate from "../../../components/templates/CardTemplate";
import {Typography} from "@mui/material";
import DetailsGrid from "../../../components/templates/DetailsGrid";

interface IProps {
    user: IUser;
}

const UserDetails: FC<IProps> = ({user}) => {
    const dispatch = useAppDispatch();
    const [isEditMode, setIsEditMode] = useState(false);
    useEffect(() => {
        if (user) {
            setEditedValue(user);
        }
    }, [user]);
    const toggleIsEditMode = () => {
        setIsEditMode((prev) => !prev);
    };
    const {editedValue, errors, setEditedValue, handleFieldChange} = useEditor<IUserWithPassport>({
        initialValue: user ?? defaultUser,
        validate: userUpdateValidate,
    });
    const updateUserHandler = () => {
        if (editedValue) {
            toggleIsEditMode();
            dispatch(fetchUpdateUser(editedValue));
        }
    };
    const cancelUpdateUserHandler = () => {
        toggleIsEditMode();
        setEditedValue(user);
    };
    return (
        <CardTemplate>
            <DetailsGrid>
                <UserView
                    editedUser={editedValue}
                    isEditMode={isEditMode}
                    errors={errors}
                    userFieldChangeHandler={handleFieldChange}
                />
            </DetailsGrid>
            {!isEditMode && (
                <Typography variant={"subtitle2"} textAlign={"center"} color={"text.secondary"}>
                    Вы можете отредактировать свои данные.
                </Typography>
            )}

            <ButtonsEditCancelSave
                isEditMode={isEditMode}
                isValid={!Object.keys(errors).length}
                toggleIsEditMode={toggleIsEditMode}
                updateHandler={updateUserHandler}
                cancelUpdateHandler={cancelUpdateUserHandler}
            />
        </CardTemplate>
    );
};

export default UserDetails;
