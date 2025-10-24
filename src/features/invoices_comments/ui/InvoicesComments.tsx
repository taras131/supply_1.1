import React from 'react';
import {Stack} from "@mui/material";
import InvoiceCommentsAddNew from "./InvoiceCommentsAddNew";
import {useAppSelector} from "../../../hooks/redux";
import CommentItem from "../../../components/comments/CommentItem";
import {selectAllInvoicesComments} from "../model/selectors";

const InvoicesComments = () => {
    const comments = useAppSelector(selectAllInvoicesComments);
    const commentsList = comments?.map((comment) => (
        <CommentItem key={comment.id}
                     comment={comment}/>
    ));
    return (
        <Stack spacing={2}>
            <InvoiceCommentsAddNew/>
            {commentsList}
        </Stack>
    );
};

export default InvoicesComments;