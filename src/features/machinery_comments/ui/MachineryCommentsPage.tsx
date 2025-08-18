import React, {useEffect} from "react";
import {useAppDispatch} from "../../../hooks/redux";
import {fetchGetAllMachineryComment} from "../model/actions";
import MachineryComments from "./MachineryComments";
import {fetchGetAllMachinery} from "../../machinery/model/actions";

const MachineryCommentsPage = () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchGetAllMachineryComment());
        dispatch(fetchGetAllMachinery());
    }, [dispatch]);
    return (
        <div>
            MachineryCommentsPage
            <MachineryComments isShowMachineryInfo/>
        </div>
    );
};

export default MachineryCommentsPage;
