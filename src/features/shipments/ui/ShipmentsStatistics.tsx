import React from 'react';
import {useTheme, alpha} from '@mui/material/styles';
import {Box, Grid, Card, CardContent, Typography, Alert, Skeleton, Paper} from '@mui/material';
import {ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar} from 'recharts';
import {selectShipmentsIsLoading, selectShipmentsStatistics} from "../model/selectors";
import {useAppSelector} from "../../../hooks/redux";

const ShipmentsStatistics: React.FC = () => {
    const theme = useTheme();
    const data = useAppSelector(selectShipmentsStatistics);
    const loading = useAppSelector(selectShipmentsIsLoading);

    const CustomTooltip = ({active, payload, label}: any) => {
        if (active && payload && payload.length) {
            return (
                <Paper
                    sx={{
                        p: 2,
                        backgroundColor: alpha(theme.palette.background.paper, 0.95),
                        border: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Typography variant="subtitle2" gutterBottom>
                        {label}
                    </Typography>
                    {payload.map((entry: any, index: number) => (
                        <Typography key={index} variant="body2" sx={{color: entry.color}}>
                            {entry.name}: {entry.value} шт.
                        </Typography>
                    ))}
                </Paper>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <Box sx={{p: 3}}>
                <Grid columns={12} rowSpacing={3} columnSpacing={3}>
                    <Grid>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Неполученные отгрузки</Typography>
                                <Skeleton variant="text" width="40%" height={48}/>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid>
                        <Card>
                            <CardContent>
                                <Skeleton variant="rectangular" height={400}/>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        );
    }

    if (!data) {
        return (
            <Box sx={{p: 3}}>
                <Alert severity="info">Нет данных для отображения</Alert>
            </Box>
        );
    }

    const types = Object.entries(data.unreceived_by_type);
    const totalUnreceived = types.reduce((sum, [, count]) => sum + count, 0);

    return (
        <Box sx={{p: 3}}>
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 3, md: 3 }}>
                    <Card
                        sx={{
                            background: `linear-gradient(135deg,
                             ${alpha(theme.palette.warning.main, 0.1)} 0%, 
                             ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
                            border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                        }}
                    >
                        <CardContent>
                            <Typography variant="h6" color="warning.main" gutterBottom>
                                Всего неполученных
                            </Typography>
                            <Typography variant="h4" fontWeight="bold">
                                {totalUnreceived}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                шт.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                {types.map(([type, count]) => (
                    <Grid size={{xs: 4, md: 4}} key={type}>
                        <Card
                            sx={{
                                background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(
                                    theme.palette.warning.main,
                                    0.05
                                )} 100%)`,
                                border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6" color="warning.main" gutterBottom>
                                    Неполученные ({type})
                                </Typography>
                                <Typography variant="h4" fontWeight="bold">
                                    {count}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    шт.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{mb: 3}}>
                        Отгрузки по месяцам ({data.meta.previous_year} vs {data.meta.current_year})
                    </Typography>

                    <Box sx={{width: '100%', height: 450}}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data.chart_data}
                                margin={{top: 20, right: 30, left: 20, bottom: 60}}
                                barCategoryGap="20%"
                                barGap={4}
                            >
                                <CartesianGrid vertical={false} strokeDasharray="3 3"
                                               stroke={alpha(theme.palette.divider, 0.2)}/>
                                <XAxis
                                    dataKey="month"
                                    tickFormatter={(val: string) => val.split(' ')[0]}
                                    angle={-45}
                                    textAnchor="end"
                                    height={80}
                                    fontSize={12}
                                    stroke={theme.palette.text.secondary}
                                />
                                <YAxis fontSize={12} stroke={theme.palette.text.secondary}/>
                                <Tooltip content={<CustomTooltip/>}/>
                                <Legend/>
                                <Bar
                                    dataKey="previous_year"
                                    name={`${data.meta.previous_year} год`}
                                    fill={theme.palette.primary.main}
                                    radius={[2, 2, 0, 0]}
                                    barSize={32}
                                />
                                <Bar
                                    dataKey="current_year"
                                    name={`${data.meta.current_year} год`}
                                    fill={theme.palette.secondary.main}
                                    radius={[2, 2, 0, 0]}
                                    barSize={32}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{mt: 2}}>
                        * График показывает полученные отгрузки по месяцам
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ShipmentsStatistics;

