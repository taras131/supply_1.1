import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Paper,
    Skeleton,
    Alert,
    useTheme,
    alpha
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import {selectInvoicesIsLoading, selectInvoicesStatistics} from "../../invoices/model/selectors";
import {useAppSelector} from "../../../hooks/redux";

const InvoicesStatistics: React.FC = () => {
    const theme = useTheme();
    const data = useAppSelector(selectInvoicesStatistics);
    const loading = useAppSelector(selectInvoicesIsLoading);
    // Форматирование чисел для отображения
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Кастомный компонент Tooltip для графика
    const CustomTooltip = ({ active, payload, label }: any) => {
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
                        <Typography
                            key={index}
                            variant="body2"
                            sx={{ color: entry.color }}
                        >
                            {entry.name}: {formatCurrency(entry.value)}
                        </Typography>
                    ))}
                </Paper>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card>
                            <CardContent>
                                <Skeleton variant="text" width="60%" height={32} />
                                <Skeleton variant="text" width="40%" height={48} />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card>
                            <CardContent>
                                <Skeleton variant="text" width="60%" height={32} />
                                <Skeleton variant="text" width="40%" height={48} />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={12}>
                        <Card>
                            <CardContent>
                                <Skeleton variant="rectangular" height={400} />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        );
    }

    if (!data) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="info">
                    Нет данных для отображения
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Карточки со статистикой неоплаченных счетов */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card
                        sx={{
                            background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
                            border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                        }}
                    >
                        <CardContent>
                            <Typography variant="h6" color="warning.main" gutterBottom>
                                Неоплаченные счета
                            </Typography>
                            <Typography variant="h4" fontWeight="bold">
                                {data.unpaid_statistics.count}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                штук
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Card
                        sx={{
                            background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)} 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)`,
                            border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                        }}
                    >
                        <CardContent>
                            <Typography variant="h6" color="error.main" gutterBottom>
                                Сумма неоплаченных
                            </Typography>
                            <Typography variant="h4" fontWeight="bold">
                                {formatCurrency(data.unpaid_statistics.total_amount)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                к оплате
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* График расходов по месяцам */}
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                        Расходы по месяцам ({data.meta.previous_year} vs {data.meta.current_year})
                    </Typography>

                    <Box sx={{ width: '100%', height: 450 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data.chart_data}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 60,
                                }}
                                barCategoryGap="20%"    // расстояние между категориями (месяцами)
                                barGap={4}              // расстояние между столбцами в одной категории
                            >
                                <CartesianGrid
                                    vertical={false}
                                    strokeDasharray="3 3"
                                    stroke={alpha(theme.palette.divider, 0.2)}
                                />
                                <XAxis
                                    tickFormatter={(val: string) => val.split(' ')[0]}
                                    dataKey="month"
                                    angle={-45}
                                    textAnchor="end"
                                    height={80}
                                    fontSize={12}
                                    stroke={theme.palette.text.secondary}
                                />
                                <YAxis
                                    tickFormatter={formatCurrency}
                                    fontSize={12}
                                    stroke={theme.palette.text.secondary}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar
                                    dataKey="previous_year"
                                    name={`${data.meta.previous_year} год`}
                                    fill={theme.palette.primary.main}
                                    radius={[2, 2, 0, 0]}
                                    barSize={32}         // толщина столбцов
                                />
                                <Bar
                                    dataKey="current_year"
                                    name={`${data.meta.current_year} год`}
                                    fill={theme.palette.secondary.main}
                                    radius={[2, 2, 0, 0]}
                                    barSize={32}         // толщина столбцов
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        * График показывает оплаченные счета по месяцам
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default InvoicesStatistics;