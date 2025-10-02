import React, {useEffect, useMemo, useState} from 'react';
import {Alert, Stack} from "@mui/material";
import ProblemDetailsPageHeader from "./ProblemDetailsPageHeader";
import Card from "@mui/material/Card";
import {Link, useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {fetchGetMachineryProblemById, fetchUpdateMachineryProblem} from "../model/actions";
import {selectCurrentProblem, selectMachineryProblemsIsLoading} from "../model/selectors";
import ProblemDetailsHeader from "./ProblemDetailsHeader";
import ProblemDetailsPhotos from "./ProblemDetailsPhotos";
import ProblemView from "./ProblemView";
import TitleWithValue from "../../../components/TitleWithValue";
import AiSolutionView from "./AiSolutionView";
import Box from "@mui/material/Box";
import ButtonsEditCancelSave from "../../../components/common/ButtonsEditCancelSave";
import RelatedTasks from "../../machinery_tasks/ui/RelatedTasks";
import {routes} from "../../../utils/routes";
import CreateUpdateUserInfo from "../../../components/common/CreateUpdateUserInfo";
import {useEditor} from "../../../hooks/useEditor";
import {defaultProblem, IMachineryProblem} from "../../../models/IMachineryProblems";
import {problemValidate} from "../../../utils/validators";
import {setCurrentProblem} from "../model/slice";
import {AiSolution, parseAiSolution} from "../../../utils/aiSolution";
import PageTemplate from "../../../components/templates/PageTemplate";

const ProblemDetailsPage = () => {
    const dispatch = useAppDispatch();
    const problemId = useParams().problemId || "0";
    const currentProblem = useAppSelector(selectCurrentProblem);
    const isLoading = useAppSelector(selectMachineryProblemsIsLoading)
    const [isEditMode, setIsEditMode] = useState(false);
    const {editedValue, errors, handleFieldChange, setEditedValue} = useEditor<IMachineryProblem>({
        initialValue: currentProblem || defaultProblem,
        validate: problemValidate,
    });
    useEffect(() => {
        if (currentProblem) {
            setEditedValue(currentProblem);
        }
    }, [currentProblem]);

    useEffect(() => {
        if (problemId) {
            dispatch(fetchGetMachineryProblemById(problemId))
        }
    }, [problemId, dispatch])
    const rawSolution = useMemo<unknown>(() => {
        // Может быть объектом, строкой или null. Берём как есть.
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
        <PageTemplate>
            <ProblemDetailsPageHeader/>
            <Stack direction={"row"} spacing={4} sx={{width: '100%'}}>
                <Card sx={{width: '100%', p: 4}}>
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
                    {!isEditMode && (
                        <>
                            <RelatedTasks
                                machineryId={currentProblem.machinery_id}
                                tasks={currentProblem.tasks || null}
                                problemId={currentProblem.id}
                            />
                            <Stack spacing={1}>
                                {currentProblem.machinery && (
                                    <Link
                                        to={routes.machineryDetails.replace(":machineryId", currentProblem.machinery.id)}>
                                        <TitleWithValue
                                            title={"Техника:"}
                                            value={`${currentProblem.machinery.brand} ${currentProblem.machinery.model}`}
                                        />
                                    </Link>
                                )}
                                <CreateUpdateUserInfo
                                    author={currentProblem.author || null}
                                    updatedAuthor={currentProblem.updated_author || null}
                                    createdAT={currentProblem.created_at}
                                    updatedAt={currentProblem.updated_at || null}
                                />
                            </Stack>
                        </>
                    )}
                </Card>
                <>
                    {(solutionSummary || aiSolution || rawSolution) && (
                        <Card sx={{width: '100%', p: 5}}>
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
                            </Stack>
                        </Card>
                    )}
                </>
            </Stack>
        </PageTemplate>
    );
};

export default ProblemDetailsPage;