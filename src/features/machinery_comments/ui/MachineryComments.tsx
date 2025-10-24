import React, {FC} from "react";
import {useAppSelector} from "../../../hooks/redux";
import {selectAllMachineryComments} from "../model/selectors";
import {List, Typography} from "@mui/material";
import MachineryCommentsAddNew from "./MachineryCommentsAddNew";
import CommentItem from "../../../components/comments/CommentItem";

interface IProps {
    isShowMachineryInfo?: boolean;
}

const MachineryComments: FC<IProps> = ({isShowMachineryInfo = false}) => {
    const comments = useAppSelector(selectAllMachineryComments);
    const commentsList = comments?.map((comment) => (
        <CommentItem key={comment.id}
                      comment={comment}
                      isShowMachineryInfo={isShowMachineryInfo}/>
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
