import React, {FC, useEffect} from "react";
import {Button, Drawer, Stack, Typography} from "@mui/material";
import {useEditor} from "../../../hooks/useEditor";
import {problemValidate} from "../../../utils/validators";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import usePhotoManager from "../../../hooks/usePhotoManager";
import PhotosManager from "../../../components/common/PhotosManager";
import Box from "@mui/material/Box";
import {emptyProblem, INewMachineryProblem} from "../../../models/IMachineryProblems";
import {fetchAddMachineryProblem} from "../model/actions";
import ProblemView from "./ProblemView";
import {fetchGetAllMachinery} from "../../machinery/model/actions";
import FieldControl from "../../../components/common/FieldControl";
import {selectAllMachineryForOptions} from "../../machinery/model/selectors";
import {selectMachineryProblemsIsLoading} from "../model/selectors";

interface IProps {
    isOpen: boolean;
    isShowMachineryInfo: boolean;
    onClose: (event: React.KeyboardEvent | React.MouseEvent) => void;
}

const ProblemAddNew: FC<IProps> = ({isOpen, isShowMachineryInfo, onClose}) => {
    const dispatch = useAppDispatch();
    const machineryList = useAppSelector(selectAllMachineryForOptions);
    const isLoading = useAppSelector(selectMachineryProblemsIsLoading)
    const {tempFiles, onAddPhotos, onDeletePhoto, clearPhotos} = usePhotoManager();
    const {editedValue, errors, handleFieldChange, resetValue} = useEditor<INewMachineryProblem>({
        initialValue: JSON.parse(JSON.stringify(emptyProblem)),
        validate: problemValidate,
    });
    useEffect(() => {
        dispatch(fetchGetAllMachinery());
        return () => clearPhotos();
    }, [dispatch, isShowMachineryInfo, clearPhotos]);
    const addClickHandler = async () => {
        const newFiles = [...tempFiles.map((fileData) => fileData.file)];
        clearPhotos();
        resetValue();
        await dispatch(
            fetchAddMachineryProblem({
                newProblem: {
                    ...editedValue,
                    odometer: +editedValue.odometer,
                    operating: +editedValue.operating,
                },
                files: newFiles,
            }),
        );
        const syntheticClickEvent = {
            preventDefault: () => {
            },  // Пустая функция
            stopPropagation: () => {
            }, // Пустая функция
            nativeEvent: new MouseEvent('click'),  // Нативное событие
            currentTarget: document.createElement('div'),  // Фиктивный элемент
            target: document.createElement('div'),  // Фиктивный target
            bubbles: true,
            cancelable: true,
            defaultPrevented: false,
            eventPhase: 0,
            isTrusted: true,
            timeStamp: Date.now(),
            type: 'click',
            // Добавьте недостающие свойства (минимальный набор для обхода ошибки)
            altKey: false,
            button: 0,
            buttons: 0,
            clientX: 0,
            clientY: 0,
            ctrlKey: false,
            metaKey: false,
            movementX: 0,
            movementY: 0,
            offsetX: 0,
            offsetY: 0,
            pageX: 0,
            pageY: 0,
            relatedTarget: null,
            screenX: 0,
            screenY: 0,
            shiftKey: false,
            x: 0,
            y: 0,
            getModifierState: () => false,  // Пустая функция для modifier states
        };

        // Двойное утверждение типа для обхода TS2352
        onClose((syntheticClickEvent as unknown) as React.MouseEvent);
    };
    return (
        <Drawer anchor="right" open={isOpen} onClose={onClose}>
            <Box
                sx={{
                    padding: "16px",
                    maxWidth: "500px",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                }}
            >
                <Typography color="primary" variant="h2" fontSize={"20px"} fontWeight={600} sx={{marginBottom: "8px"}}>
                    Новая проблема
                </Typography>
                {isShowMachineryInfo && (
                    <FieldControl
                        label="Техника"
                        name="machinery_id"
                        id="machinery_id"
                        value={editedValue.machinery_id}
                        error={isShowMachineryInfo && editedValue.machinery_id === "-1" ? "Выбирите технику" : ""}
                        isEditMode
                        onChange={handleFieldChange}
                        options={machineryList}
                        isRequired
                    />
                )}
                <ProblemView problem={editedValue} errors={errors} fieldChangeHandler={handleFieldChange}
                             isEditMode={true}/>
                <PhotosManager
                    onAddPhotos={onAddPhotos}
                    onDeletePhoto={onDeletePhoto}
                    photosPaths={tempFiles.map((fileData) => fileData.preview)}
                />
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Button onClick={onClose} variant="outlined">
                        Назад
                    </Button>
                    <Button
                        onClick={addClickHandler}
                        variant="contained"
                        color="success"
                        loading={isLoading}
                        disabled={!!Object.keys(errors).length || (isShowMachineryInfo && editedValue.machinery_id === "-1")}
                    >
                        Сохранить
                    </Button>
                </Stack>
            </Box>
        </Drawer>
    );
};

export default ProblemAddNew;
