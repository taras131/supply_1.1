import React, {FC, useEffect, useState} from "react";
import MachineryAdditionalView from "./MachineryAdditionalView";
import MachineryBasicView from "./MachineryBasicView";
import {useEditor} from "../../../hooks/useEditor";
import {defaultMachinery, ICurrentMachinery} from "../../../models/iMachinery";
import {machineryValidate} from "../../../utils/validators";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {selectCurrentMachinery} from "../model/selectors";
import {fetchUpdateMachinery} from "../model/actions";
import ButtonsEditCancelSave from "../../../components/common/ButtonsEditCancelSave";
import CardTemplate from "../../../components/templates/CardTemplate";
import DetailsGrid from "../../../components/templates/DetailsGrid";

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
    const {editedValue, errors, setEditedValue, handleFieldChange} = useEditor<ICurrentMachinery>({
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
            <CardTemplate title={"Основные сведения:"}>
                <DetailsGrid isEditMode={isAdditionalEditMode}>
                    <MachineryBasicView
                        editedMachinery={editedValue}
                        isEditMode={isBasicEditMode}
                        errors={errors}
                        machineryFieldChangeHandler={handleFieldChange}
                    />
                </DetailsGrid>
                <ButtonsEditCancelSave
                    isEditMode={isBasicEditMode}
                    isValid={!Object.keys(errors).length}
                    cancelUpdateHandler={cancelUpdateMachineryHandler}
                    toggleIsEditMode={toggleIsBasicEditMode}
                    updateHandler={updateMachineryHandler}
                />
            </CardTemplate>
            <CardTemplate title={"Дополнительные сведения:"}>
                <DetailsGrid isEditMode={isAdditionalEditMode}>
                    <MachineryAdditionalView
                        editedMachinery={editedValue}
                        isEditMode={isAdditionalEditMode}
                        errors={errors}
                        machineryFieldChangeHandler={handleFieldChange}
                    />
                </DetailsGrid>
                <ButtonsEditCancelSave
                    isEditMode={isAdditionalEditMode}
                    isValid={!Object.keys(errors).length}
                    cancelUpdateHandler={cancelUpdateMachineryHandler}
                    toggleIsEditMode={toggleIsAdditionalEditMode}
                    updateHandler={updateMachineryHandler}
                />
            </CardTemplate>
        </>
    );
};

export default MachineryView;
