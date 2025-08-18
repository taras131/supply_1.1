import React, { FC, useEffect, useState } from "react";
import UserView from "./UserView";
import { useEditor } from "../../../hooks/useEditor";
import { defaultUser, IUser, IUserWithPassport } from "../../../models/IUser";
import { userUpdateValidate } from "../../../utils/validators";
import { useAppDispatch } from "../../../hooks/redux";
import { fetchUpdateUser } from "../model/actions";
import ViewCardPattern from "../../../components/common/ViewCardPattern";
import ButtonsEditCancelSave from "../../../components/common/ButtonsEditCancelSave";

interface IProps {
  user: IUser;
}

const UserDetails: FC<IProps> = ({ user }) => {
  const dispatch = useAppDispatch();
  const [isEditMode, setIsEditMode] = useState(false);
  useEffect(() => {
    if (user) {
      setEditedValue(user);
    }
  }, [user, setEditedValue]);
  const toggleIsEditMode = () => {
    setIsEditMode((prev) => !prev);
  };
  const { editedValue, errors, setEditedValue, handleFieldChange } = useEditor<IUserWithPassport>({
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
    <ViewCardPattern isEditMode={isEditMode} footer={isEditMode ? "" : "Вы можете отредактировать свои данные"}>
      <UserView
        editedUser={editedValue}
        isEditMode={isEditMode}
        errors={errors}
        userFieldChangeHandler={handleFieldChange}
      />
      <ButtonsEditCancelSave
        isEditMode={isEditMode}
        isValid={!Object.keys(errors).length}
        toggleIsEditMode={toggleIsEditMode}
        updateHandler={updateUserHandler}
        cancelUpdateHandler={cancelUpdateUserHandler}
      />
    </ViewCardPattern>
  );
};

export default UserDetails;
