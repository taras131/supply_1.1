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
        <Stack spacing={2}>
            <Typography variant={"h5"} sx={{ marginBottom: "16px" }}>
                AI рекомендация
            </Typography>
            <Box>
                <Typography variant="subtitle2" color="text.secondary">Кратко</Typography>
                <Typography variant="body1">{solution.summary || "—"}</Typography>
            </Box>
            <Divider/>
            <Box>
                <Typography variant="subtitle2" color="text.secondary">Гипотезы неисправности</Typography>
                <Stack spacing={1} sx={{mt: 1}}>
                    {solution.diagnosis_hypotheses?.map((h, i) => (
                        <Box key={i} sx={{p: 1.5, border: "1px solid #eee", borderRadius: 1}}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="body1" fontWeight={600}>{h.cause || "—"}</Typography>
                                <Chip
                                    size="small"
                                    color={likelihoodColor(h.likelihood ?? 0)}
                                    label={`${Math.round((h.likelihood ?? 0) * 100)}%`}
                                />
                            </Stack>
                            {h.rationale && (
                                <Typography variant="body2" color="text.secondary" sx={{mt: 0.5}}>
                                    {h.rationale}
                                </Typography>
                            )}
                        </Box>
                    ))}
                </Stack>
            </Box>
            <Divider/>
            <Box>
                <Typography variant="subtitle2" color="text.secondary">Проверки</Typography>
                <Stack spacing={1} sx={{mt: 1}}>
                    {solution.checks?.map((c, i) => (
                        <Box key={i} sx={{p: 1.5, border: "1px solid #eee", borderRadius: 1}}>
                            <Typography variant="body1" fontWeight={600}>{c.step || "—"}</Typography>
                            <Typography variant="body2"><b>Как:</b> {c.how_to || "—"}</Typography>
                            <Typography variant="body2"><b>Ожидаемо:</b> {c.expected || "—"}</Typography>
                            <Typography variant="body2"><b>Если не ок:</b> {c.next_if_fail || "—"}</Typography>
                        </Box>
                    ))}
                </Stack>
            </Box>
            <Divider/>
            <Box>
                <Typography variant="subtitle2" color="text.secondary">Шаги ремонта</Typography>
                <Stack spacing={1} sx={{mt: 1}}>
                    {solution.repair_steps?.map((r, i) => (
                        <Box key={i} sx={{p: 1.5, border: "1px solid #eee", borderRadius: 1}}>
                            <Typography variant="body1" fontWeight={600}>{r.step || "—"}</Typography>
                            <Typography variant="body2"><b>Инструменты:</b> {r.tools?.length ? r.tools.join(", ") : "—"}
                            </Typography>
                            <Typography variant="body2"><b>Запчасти:</b> {r.parts?.length ? r.parts.join(", ") : "—"}
                            </Typography>
                            <Typography variant="body2"><b>Предосторожности:</b> {r.precautions || "—"}</Typography>
                        </Box>
                    ))}
                </Stack>
            </Box>
        </Stack>
    );
};

export default AiSolutionView;