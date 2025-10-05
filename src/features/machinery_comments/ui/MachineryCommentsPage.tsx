import React, {useEffect} from "react";
import {useAppDispatch} from "../../../hooks/redux";
import {fetchGetAllMachineryComment} from "../model/actions";
import MachineryComments from "./MachineryComments";
import {fetchGetAllMachinery} from "../../machinery/model/actions";
import PageTemplate from "../../../components/templates/PageTemplate";
import PageHeaderTemplate from "../../../components/templates/PageHeaderTemplate";

const MachineryCommentsPage = () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchGetAllMachineryComment());
        dispatch(fetchGetAllMachinery());
    }, [dispatch]);
    return (
        <PageTemplate authOnly>
            <PageHeaderTemplate title={"Заметки"}/>
            <MachineryComments isShowMachineryInfo/>
        </PageTemplate>
    );
};

export default MachineryCommentsPage;
