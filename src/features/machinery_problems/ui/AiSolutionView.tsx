import React from 'react';
import {AiSolution} from "../../../utils/aiSolution";
import {FC} from "react";
import {Stack, Typography, Box, Divider, Chip} from "@mui/material"

function likelihoodColor(p: number): "default" | "success" | "warning" | "error" {
    if (p >= 0.66) return "success";
    if (p >= 0.33) return "warning";
    return "error";
}

const AiSolutionView: FC<{ solution: AiSolution }> = ({solution}) => {
    return (
        <Stack spacing={2} pt={2}>
            <Typography variant={"h5"} fontSize={20} sx={{marginBottom: "16px"}}>
                AI гипотезы:
            </Typography>
            <Box>
                <Typography variant="subtitle2" color={"text.secondary"}>
                    {solution.summary || "—"}
                </Typography>
            </Box>
            <Box>
                {/* <Typography variant="body1" fontWeight={600}>
                    Гипотезы неисправности:
                </Typography>*/}
                <Stack spacing={1} sx={{mt: 1}}>
                    {solution.diagnosis_hypotheses?.map((h, i) => (
                        <Box key={i} sx={{p: 1}}>
                            <Stack direction="row"
                                   spacing={1}
                                   alignItems="center"
                                   justifyContent={"space-between"}>
                                <Typography variant="subtitle1">
                                    {h.cause || "—"}
                                </Typography>
                                <Chip
                                    size="small"
                                    color={likelihoodColor(h.likelihood ?? 0)}
                                    label={`${Math.round((h.likelihood ?? 0) * 100)}%`}
                                />
                            </Stack>
                            {h.rationale && (
                                <Typography variant="subtitle2" color="text.secondary" sx={{mt: 0.5}}>
                                    {h.rationale}
                                </Typography>
                            )}
                        </Box>
                    ))}
                </Stack>
            </Box>
            {/*  <Box>
                <Typography variant="body1" fontWeight={600}>Проверки:</Typography>
                <Stack spacing={1} sx={{mt: 1}}>
                    {solution.checks?.map((c, i) => (
                        <Box key={i} sx={{p: 1}}>
                            <Typography variant="subtitle1">
                                {c.step || "—"}
                            </Typography>
                            <Typography variant="subtitle2" color={"text.secondary"}>
                                <b>Как:</b> {c.how_to || "—"}
                            </Typography>
                            <Typography variant="subtitle2" color={"text.secondary"}>
                                <b>Ожидаемо:</b> {c.expected || "—"}
                            </Typography>
                            <Typography variant="subtitle2" color={"text.secondary"}>
                                <b>Если не ок:</b> {c.next_if_fail || "—"}
                            </Typography>
                        </Box>
                    ))}
                </Stack>
            </Box>
            <Divider color={"primary"}/>
            <Box>
                <Typography variant="body1" fontWeight={600}>Шаги ремонта:</Typography>
                <Stack spacing={1} sx={{mt: 1}}>
                    {solution.repair_steps?.map((r, i) => (
                        <Box key={i} sx={{p: 1}}>
                            <Typography variant="subtitle1">
                                {r.step || "—"}
                            </Typography>
                            <Typography variant="subtitle2"  color={"text.secondary"}>
                                <b>Инструменты:</b> {r.tools?.length ? r.tools.join(", ") : "—"}
                            </Typography>
                            <Typography variant="subtitle2" color={"text.secondary"}>
                                <b style={{color: "text.primary"}}>Запчасти:</b> {r.parts?.length ? r.parts.join(", ") : "—"}
                            </Typography>
                            <Typography variant="subtitle2" color={"text.secondary"}>
                                <b>Предосторожности:</b> {r.precautions || "—"}
                            </Typography>
                        </Box>
                    ))}
                </Stack>
            </Box>*/}
        </Stack>
    );
};

export default AiSolutionView;