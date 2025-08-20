import {FC} from "react";
import {LinearProgress, Tooltip, Typography} from "@mui/material";
import Box from "@mui/material/Box";


const CompletionBar: FC<{
    percent?: number;
    done?: number;
    total?: number;
    itemsDone?: number;
    itemsTotal?: number;
}> = ({percent, done, total, itemsDone, itemsTotal}) => {
    const pct = Math.max(0, Math.min(100, Math.round(Number(percent ?? 0))));
    const color =
        pct >= 67 ? 'success.main' : pct >= 34 ? 'warning.main' : 'error.main';
    const tooltip = [
        `Позиции: ${done ?? 0}/${total ?? 0} (${pct}%)`,
        itemsTotal != null && itemsDone != null
            ? `Штук: ${itemsDone}/${itemsTotal} (${itemsTotal ? Math.round((itemsDone / itemsTotal) * 100) : 0}%)`
            : null,
    ]
        .filter(Boolean)
        .join(' · ');
    return (
        <Box sx={{display: "flex", alignItems: "center", justifyContent: "center", height: "100%"}}>
            <Tooltip title={tooltip} arrow>
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        px: 1,
                    }}
                >
                    {/* Прогресс-бар занимает всё доступное пространство слева */}
                    <Box sx={{position: 'relative', height: 24, flex: 1}}>
                        <LinearProgress
                            variant="determinate"
                            value={pct}
                            sx={{
                                height: 20,
                                borderRadius: 2,
                                backgroundColor: 'grey.300',
                                '& .MuiLinearProgress-bar': {backgroundColor: color},
                            }}
                        />
                        {/* Процент по центру полосы */}
                        <Box
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                pointerEvents: 'none',
                            }}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    color: pct >= 50 ? 'common.white' : 'text.primary',
                                    fontWeight: 600,
                                }}
                            >
                                {pct}%
                            </Typography>
                        </Box>
                    </Box>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                            minWidth: 40,
                            textAlign: 'right',
                            fontVariantNumeric: 'tabular-nums',
                        }}
                    >
                        {(done ?? 0)}/{(total ?? 0)}
                    </Typography>
                </Box>
            </Tooltip>
        </Box>
    );
};

export default CompletionBar;