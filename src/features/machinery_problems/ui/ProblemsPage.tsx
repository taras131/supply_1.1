import React, {useEffect} from "react";
import {useAppDispatch} from "../../../hooks/redux";
import {fetchGetAllMachineryProblem} from "../model/actions";
import Problems from "./Problems";
import PageTemplate from "../../../components/templates/PageTemplate";

const ProblemsPage = () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchGetAllMachineryProblem());
    }, [dispatch]);
    return (
        <PageTemplate authOnly>
            <Problems isShowMachineryInfo/>
        </PageTemplate>);
};

export default ProblemsPage;
