import React, { FC, useEffect, useState } from "react";
import MachineryAdditionalView from "./MachineryAdditionalView";
import MachineryBasicView from "./MachineryBasicView";
import { useEditor } from "../../../hooks/useEditor";
import { defaultMachinery, ICurrentMachinery } from "../../../models/iMachinery";
import { machineryValidate } from "../../../utils/validators";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { selectCurrentMachinery } from "../model/selectors";
import { fetchUpdateMachinery } from "../model/actions";
import ViewCardPattern from "../../../components/common/ViewCardPattern";
import ButtonsEditCancelSave from "../../../components/common/ButtonsEditCancelSave";

const MachineryView: FC = () => {
  const dispatch = useAppDispatch();
  const machinery = useAppSelector(selectCurrentMachinery);
  const [isBasicEditMode, setIsBasicEditMode] = useState(false);
  const [isAdditionalEditMode, setIsAdditionalEditMode] = useState(false);
  useEffect(() => {
    if (machinery) {
      setEditedValue(machinery);
    }
  }, [machinery]);
  const { editedValue, errors, setEditedValue, handleFieldChange } = useEditor<ICurrentMachinery>({
    initialValue: machinery ?? defaultMachinery,
    validate: machineryValidate,
  });
  if (!machinery) return null;
  const toggleIsBasicEditMode = () => {
    setIsBasicEditMode((prev) => !prev);
  };
  const toggleIsAdditionalEditMode = () => {
    setIsAdditionalEditMode((prev) => !prev);
  };
  const updateMachineryHandler = () => {
    if (editedValue) {
      setIsBasicEditMode(false);
      setIsAdditionalEditMode(false);
      dispatch(fetchUpdateMachinery(editedValue));
    }
  };
  const cancelUpdateMachineryHandler = () => {
    setIsBasicEditMode(false);
    setIsAdditionalEditMode(false);
    setEditedValue(machinery);
  };
  return (
    <>
      <ViewCardPattern title={"Основные сведения:"} isEditMode={isBasicEditMode}>
        <MachineryBasicView
          editedMachinery={editedValue}
          isEditMode={isBasicEditMode}
          errors={errors}
          machineryFieldChangeHandler={handleFieldChange}
        />
        <ButtonsEditCancelSave
          isEditMode={isBasicEditMode}
          isValid={!Object.keys(errors).length}
          cancelUpdateHandler={cancelUpdateMachineryHandler}
          toggleIsEditMode={toggleIsBasicEditMode}
          updateHandler={updateMachineryHandler}
        />
      </ViewCardPattern>
      <ViewCardPattern title={"Дополнительные сведения:"} isEditMode={isAdditionalEditMode}>
        <MachineryAdditionalView
          editedMachinery={editedValue}
          isEditMode={isAdditionalEditMode}
          errors={errors}
          machineryFieldChangeHandler={handleFieldChange}
        />
        <ButtonsEditCancelSave
          isEditMode={isAdditionalEditMode}
          isValid={!Object.keys(errors).length}
          cancelUpdateHandler={cancelUpdateMachineryHandler}
          toggleIsEditMode={toggleIsAdditionalEditMode}
          updateHandler={updateMachineryHandler}
        />
      </ViewCardPattern>
    </>
  );
};

export default MachineryView;
