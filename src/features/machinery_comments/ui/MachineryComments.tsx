import React, {FC} from "react";
import {useAppSelector} from "../../../hooks/redux";
import {selectAllMachineryComments} from "../model/selectors";
import MachineryCommentsItem from "./MachineryCommentsItem";
import {List, Typography} from "@mui/material";
import MachineryCommentsAddNew from "./MachineryCommentsAddNew";

interface IProps {
    isShowMachineryInfo?: boolean;
}

const MachineryComments: FC<IProps> = ({isShowMachineryInfo = false}) => {
    const comments = useAppSelector(selectAllMachineryComments);
    const commentsList = comments?.map((comment) => (
        <MachineryCommentsItem key={comment.id} comment={comment} isShowMachineryInfo={isShowMachineryInfo}/>
    ));
    return (
        <div>
            <MachineryCommentsAddNew isShowMachineryInfo={isShowMachineryInfo}/>
            {comments.length !== 0
                ? (<List>{commentsList}</List>)
                : (<Typography variant={"subtitle2"}>Пока нет ни одной заметки</Typography>
                )}
        </div>
    );
};

export default MachineryComments;
