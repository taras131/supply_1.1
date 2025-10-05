import React, {useEffect} from "react";
import {TaskList} from "./TasksList";
import {useAppDispatch} from "../../../hooks/redux";
import {fetchGetAllMachineryTasks} from "../model/actions";
import PageTemplate from "../../../components/templates/PageTemplate";

const TasksPage = () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchGetAllMachineryTasks());
    }, [dispatch]);
    return (
        <PageTemplate authOnly>
            <TaskList isShowMachineryInformation/>
        </PageTemplate>
    );
};

export default TasksPage;
