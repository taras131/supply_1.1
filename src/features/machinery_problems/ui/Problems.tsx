import React, {FC, useState} from "react";
import {Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import ProblemsTable from "./ProblemsTable";
import ProblemAddNew from "./ProblemAddNew";
import {useAppSelector} from "../../../hooks/redux";
import {selectAllMachineryProblems} from "../model/selectors";

interface IProps {
    isShowMachineryInfo?: boolean;
}

const Problems: FC<IProps> = ({isShowMachineryInfo = false}) => {
    const [isOpenAddDrawer, setIsOpenAddDrawer] = useState(false);
    const problems = useAppSelector(selectAllMachineryProblems);
    const toggleIsOpenAddDrawer = () => {
        setIsOpenAddDrawer((prev) => !prev);
    };
    return (
        <Stack sx={{
            width: '100%',
            maxWidth: {sm: '100%', md: '1700px'},
            pt: 1.5,
        }}>
            <Stack direction="row" spacing={3} justifyContent="space-between" alignItems="center">
                <Typography variant="h4">Замечания</Typography>
                <Button onClick={toggleIsOpenAddDrawer} startIcon={<AddIcon/>} variant="contained">
                    Добавить
                </Button>
            </Stack>
            <ProblemsTable rows={problems}
                           isShowMachineryInfo={isShowMachineryInfo}/>
            <ProblemAddNew
                isOpen={isOpenAddDrawer}
                onClose={toggleIsOpenAddDrawer}
                isShowMachineryInfo={isShowMachineryInfo}
            />
        </Stack>
    );
};

export default Problems;
