import React, {FC, useState} from "react";
import {Stack} from "@mui/material";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import ProblemsTable from "./ProblemsTable";
import ProblemAddNew from "./ProblemAddNew";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {selectAllMachineryProblems} from "../model/selectors";
import ProblemDetails from "./ProblemDetails";
import {IMachineryProblem} from "../../../models/IMachineryProblems";
import {fetchGetMachineryProblemById} from "../model/actions";
import PageHeaderTemplate from "../../../components/templates/PageHeaderTemplate";

interface IProps {
    isShowMachineryInfo?: boolean;
}

const Problems: FC<IProps> = ({isShowMachineryInfo = false}) => {
    const dispatch = useAppDispatch();
    const [isOpenAddDrawer, setIsOpenAddDrawer] = useState(false);
    const problems = useAppSelector(selectAllMachineryProblems);
    const toggleIsOpenAddDrawer = () => {
        setIsOpenAddDrawer((prev) => !prev);
    };
    const handleProblemClick = (problem: IMachineryProblem) => {
        dispatch(fetchGetMachineryProblemById(problem.id));
    };
    console.log(problems);
    return (
        <Stack sx={{
            width: '100%',
            pt: 1.5,
        }} spacing={3}>
            <PageHeaderTemplate title={"Замечания"}>
                <Button onClick={toggleIsOpenAddDrawer} startIcon={<AddIcon/>} variant="contained">
                    Добавить
                </Button>
            </PageHeaderTemplate>
            <ProblemsTable rows={problems}
                           isShowMachineryInfo={isShowMachineryInfo}
                           onProblemClick={handleProblemClick}/>
            <ProblemAddNew
                isOpen={isOpenAddDrawer}
                onClose={toggleIsOpenAddDrawer}
                isShowMachineryInfo={isShowMachineryInfo}
            />
            <ProblemDetails/>
        </Stack>
    );
};

export default Problems;
