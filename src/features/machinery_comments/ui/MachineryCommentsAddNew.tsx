import React, {FC, useMemo} from "react";
import {useEditor} from "../../../hooks/useEditor";
import {commentValidate} from "../../../utils/validators";
import {emptyMachineryComment, INewMachineryComment} from "../../../models/IMachineryComment";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {fetchAddMachineryComment} from "../model/actions";
import {selectCurrentMachineryId} from "../../machinery/model/selectors";
import CommentsAddNew from "../../../components/comments/CommentsAddNew";

interface IProps {
    isShowMachineryInfo: boolean;
}

const MachineryCommentsAddNew: FC<IProps> = ({isShowMachineryInfo}) => {
    const dispatch = useAppDispatch();
    const machineryId = useAppSelector(selectCurrentMachineryId);
    const memoizedInitialValue = useMemo(
        () => JSON.parse(JSON.stringify(emptyMachineryComment)),
        []
    );
    const validate = useMemo(() => commentValidate(isShowMachineryInfo), [isShowMachineryInfo]);
    const {editedValue, errors, handleFieldChange, resetValue} = useEditor<INewMachineryComment>({
        initialValue: memoizedInitialValue,
        validate: validate,
    });
    const saveClickHandler = () => {
        dispatch(
            fetchAddMachineryComment({
                ...editedValue,
                machinery_id: isShowMachineryInfo ? editedValue.machinery_id : machineryId || "-1",
            }),
        );
        resetValue();
    };
    return (
        <CommentsAddNew editedValue={editedValue}
                        errors={errors}
                        handleFieldChange={handleFieldChange}
                        saveClickHandler={saveClickHandler}
                        isShowMachineryInfo={isShowMachineryInfo}/>

    );
};

export default MachineryCommentsAddNew;
