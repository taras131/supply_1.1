import React, {FC, useEffect, useMemo, useState} from "react";
import {Alert, Divider, Drawer, Stack, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import {useEditor} from "../../../hooks/useEditor";
import {problemValidate} from "../../../utils/validators";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {fetchUpdateMachineryProblem} from "../model/actions";
import {defaultProblem, IMachineryProblem} from "../../../models/IMachineryProblems";
import {setCurrentProblem} from "../model/slice";
import {selectCurrentProblem} from "../model/selectors";
import ProblemView from "./ProblemView";
import ButtonsEditCancelSave from "../../../components/common/ButtonsEditCancelSave";
import ProblemDetailsPhotos from "./ProblemDetailsPhotos";
import CreateUpdateUserInfo from "../../../components/common/CreateUpdateUserInfo";
import RelatedTasks from "../../machinery_tasks/ui/RelatedTasks";
import ProblemDetailsHeader from "./ProblemDetailsHeader";
import {Link} from "react-router-dom";
import {routes} from "../../../utils/routes";
import AiSolutionView from "./AiSolutionView";
import {AiSolution, parseAiSolution} from "../../../utils/aiSolution";

const ProblemDetails: FC = () => {
    const dispatch = useAppDispatch();
    const [isEditMode, setIsEditMode] = useState(false);
    const currentProblem = useAppSelector(selectCurrentProblem);
    const {editedValue, errors, handleFieldChange, setEditedValue} = useEditor<IMachineryProblem>({
        initialValue: currentProblem || defaultProblem,
        validate: problemValidate,
    });
    useEffect(() => {
        if (currentProblem) {
            setEditedValue(currentProblem);
        }
    }, [currentProblem, setEditedValue]);
    const rawSolution = useMemo<unknown>(() => {
        return (currentProblem as any)?.solution ?? null;
    }, [currentProblem]);
    const aiSolution = useMemo<AiSolution | null>(() => {
        try {
            return parseAiSolution(rawSolution);
        } catch (e) {
            console.warn("Failed to parse AI solution", e, rawSolution);
            return null;
        }
    }, [rawSolution]);
    const solutionSummary = useMemo<string | null>(() => {
        const s = currentProblem?.solution_summary;
        if (typeof s === "string" && s.trim()) return s.trim();
        return aiSolution?.summary ?? null;
    }, [currentProblem?.solution_summary, aiSolution]);
    if (!currentProblem) return null;
    const onClose = () => {
        dispatch(setCurrentProblem(null));
    };
    const toggleIsEditMode = () => {
        setIsEditMode((prev) => !prev);
    };
    const saveClickHandler = () => {
        dispatch(fetchUpdateMachineryProblem(editedValue));
        toggleIsEditMode();
    };
    return (
        <Drawer anchor="right" open={!!currentProblem} onClose={onClose}>
            <Box
                sx={{
                    padding: "28px",
                    width: "500px",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "24px",
                }}
            >
                <ProblemDetailsHeader currentProblem={currentProblem}/>
                {!isEditMode && <ProblemDetailsPhotos currentProblemPhotos={currentProblem.photos}/>}
                <Stack spacing={3} sx={{position: "relative", paddingTop: "32px", flexGrow: 1}}>
                    <ProblemView
                        problem={editedValue}
                        errors={errors}
                        fieldChangeHandler={handleFieldChange}
                        isEditMode={isEditMode}
                    />
                    <ButtonsEditCancelSave
                        isEditMode={isEditMode}
                        isValid={!Object.keys(errors).length}
                        toggleIsEditMode={toggleIsEditMode}
                        updateHandler={saveClickHandler}
                        cancelUpdateHandler={toggleIsEditMode}
                    />
                </Stack>
                <Divider color={"primary"}/>
                {!isEditMode && (
                    <>
                        <RelatedTasks
                            machineryId={currentProblem.machinery_id}
                            tasks={currentProblem.tasks || null}
                            problemId={currentProblem.id}
                        />
                        <Divider color={"primary"}/>
                        <Stack spacing={1}>
                            <>
                                {currentProblem.machinery && (
                                    <>
                                        <Typography variant={"h5"} fontSize={20} sx={{marginBottom: "16px"}}>
                                            Техника:
                                        </Typography>
                                        <Link
                                            style={{textDecoration: 'none'}}
                                            to={routes.machineryDetails.replace(":machineryId", currentProblem.machinery.id)}>
                                            {`${currentProblem.machinery.brand} ${currentProblem.machinery.model} VIN: ${currentProblem.machinery.vin}`}
                                        </Link>
                                        <Divider color={"primary"}/>
                                    </>
                                )}
                                {(solutionSummary || aiSolution || rawSolution) && (
                                    <Stack spacing={2}>
                                        {aiSolution ? (
                                            <AiSolutionView solution={aiSolution}/>
                                        ) : rawSolution ? (
                                            <>
                                                <Alert severity="warning">
                                                    Не удалось разобрать JSON рекомендации. Показан исходный текст.
                                                </Alert>
                                                <Box
                                                    component="pre"
                                                    sx={{
                                                        whiteSpace: "pre-wrap",
                                                        p: 1.5,
                                                        border: "1px solid #eee",
                                                        borderRadius: 1
                                                    }}
                                                >
                                                    {String(rawSolution)}
                                                </Box>
                                            </>
                                        ) : null}
                                        <Divider color={"primary"}/>
                                    </Stack>
                                )}
                                <CreateUpdateUserInfo
                                    author={currentProblem.author || null}
                                    updatedAuthor={currentProblem.updated_author || null}
                                    createdAT={currentProblem.created_at}
                                    updatedAt={currentProblem.updated_at || null}
                                />
                            </>
                        </Stack>
                    </>
                )}
            </Box>
        </Drawer>
    );
};

export default ProblemDetails;
