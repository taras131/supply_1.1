import React, {useEffect} from "react";
import {Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import TaskIssueView from "./TaskIssueView";
import {useEditor} from "../../../hooks/useEditor";
import {newTaskValidate} from "../../../utils/validators";
import {emptyTask, INewTask} from "../../../models/IMachineryTasks";
import Box from "@mui/material/Box";
import PhotosManager from "../../../components/common/PhotosManager";
import usePhotoManager from "../../../hooks/usePhotoManager";
import {useAppDispatch} from "../../../hooks/redux";
import Card from "@mui/material/Card";
import {fetchAddMachineryTask} from "../model/actions";
import {fetchGetAllMachinery} from "../../machinery/model/actions";
import MyButton from "../../../styles/theme/customizations/MyButton";

const TaskAddNewPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {tempFiles, onAddPhotos, onDeletePhoto, clearPhotos} = usePhotoManager();
    const location = useLocation();
    const problemId = location.state?.problemId;
    const taskTypeId = location.state?.taskTypeId;
    const machineryId = useParams()?.machineryId || "-1";
    const {editedValue, errors, handleFieldChange, setEditedValue, resetValue} = useEditor<INewTask>({
        initialValue: JSON.parse(JSON.stringify(emptyTask)),
        validate: newTaskValidate,
    });
    useEffect(() => {
        setEditedValue((prev) => ({
            ...prev,
            problem_id: problemId ?? prev.problem_id,
            type_id: taskTypeId ?? prev.type_id,
            machinery_id: machineryId !== "-1" ? machineryId : prev.machinery_id,
        }));
    }, [setEditedValue, problemId, taskTypeId, machineryId]);
    useEffect(() => {
        dispatch(fetchGetAllMachinery());
        const today = new Date();
        setEditedValue((prev) => ({
            ...prev,
            due_date: today.getTime(),
        }));
        return () => clearPhotos();
    }, []);
    const handleDateChange = (date: any) => {
        if (date && date.isValid && date.isValid()) {
            setEditedValue((prev) => ({
                ...prev,
                due_date: date.toDate().getTime(),
            }));
        }
    };
    const handleAddClick = async () => {
        const newFiles = [...tempFiles.map((fileData) => fileData.file)];
        await dispatch(fetchAddMachineryTask({newTask: editedValue, files: newFiles}));
        resetValue();
        clearPhotos();
        navigate(-1);
    };
    return (
        <Stack sx={{
            width: '100%',
            maxWidth: {sm: '100%', md: '1700px'},
            pt: 1.5,
        }}>
            <Stack direction="row"
                   spacing={3}
                   justifyContent="space-between"
                   alignItems="center"
                   sx={{mb: 2, mt: 2}}>
                <Typography component="h2" variant="h6">
                    Новая задача
                </Typography>
                <Stack direction="row" spacing={1}>
                    <MyButton variant="outlined" onClick={() => navigate(-1)}>
                        Назад
                    </MyButton>
                    <MyButton
                        onClick={handleAddClick}
                        variant={"contained"}
                        color={"success"}
                        disabled={!!Object.keys(errors).length}
                    >
                        Сохранить
                    </MyButton>
                </Stack>
            </Stack>
            <Box
                sx={{
                    width: "100%",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(min(500px, 100%), 1fr))",
                    gap: "16px",
                    marginTop: "24px",
                }}
            >
                <Card sx={{padding: "20px"}}>
                    <TaskIssueView
                        task={editedValue}
                        errors={errors}
                        isEditMode
                        isNewTask
                        fieldChangeHandler={handleFieldChange}
                        handleDateChange={handleDateChange}
                    />
                </Card>
                <Card sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <PhotosManager
                        onAddPhotos={onAddPhotos}
                        onDeletePhoto={onDeletePhoto}
                        photosPaths={tempFiles.map((fileData) => fileData.preview)}
                    />
                </Card>
            </Box>
        </Stack>
    );
};

export default TaskAddNewPage;
