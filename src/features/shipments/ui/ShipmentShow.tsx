import React, {FC, memo} from 'react';
import Card from "@mui/material/Card";
import {IShipments} from "../../../models/iShipments";
import TitleWithValue from "../../../components/TitleWithValue";
import {convertMillisecondsToDate} from "../../../utils/services";
import {Button, CardHeader, Checkbox, Chip, FormControlLabel, Stack, Typography} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {selectCurrentUserId} from "../../users/model/selectors";
import {fetchUpdateShipment} from "../model/actions";
import {selectShipmentsIsLoading} from "../model/selectors";
import DownloadIcon from "@mui/icons-material/Download";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import CardContent from "@mui/material/CardContent";

const InfoGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Box
        sx={{
            display: "grid",
            gridTemplateColumns: {
                xs: "1fr",               // мобильные — 1 колонка
                sm: "repeat(1, 1fr)",    // планшеты — 2
                md: "repeat(2, 1fr)",    // десктоп — 3
            },
            gap: 2, // одинаковые отступы между ячейками
        }}
    >
        {children}
    </Box>
);

interface IProps {
    shipment: IShipments | null;
}

const ShipmentShow: FC<IProps> = ({shipment}) => {
    console.log(shipment)
    const dispatch = useAppDispatch();
    const currentUserId = useAppSelector(selectCurrentUserId);
    const isLoading = useAppSelector(selectShipmentsIsLoading)
    const receivingChangeHandler = (checked: boolean) => {
        if (!shipment) return;
        const updated_shipment = checked
            ? {
                ...shipment,
                receiving_is_receiving: true,
                receiving_date: Date.now(),
                receiving_author_id: currentUserId,
            }
            : {
                ...shipment,
                receiving_is_receiving: false,
                receiving_date: null,
                receiving_author_id: null,
                receiving_author: null,
            };
        dispatch(fetchUpdateShipment(updated_shipment));
    };

    if (!shipment) return null;
    const transportLabel = shipment.type === "air" ? "Авиа" : "ЖД";
    const received = shipment.receiving_is_receiving;
    return (
        <Card sx={{ p: { xs: 2, sm: 3 }, minHeight: 200 }}>
            <CardHeader
                title={shipment.transporter || "Перевозчик не указан"}
                subheader={`Тип перевозки: ${transportLabel}`}
                action={
                    <Chip
                        size="small"
                        label={received ? "Получено" : "Не получено"}
                        color={received ? "success" : "default"}
                    />
                }
                sx={{
                    pb: 1,
                    "& .MuiCardHeader-title": { fontWeight: 600 },
                    "& .MuiCardHeader-subheader": { color: "text.secondary" },
                }}
            />
            <Divider sx={{ mb: 2 }} />
            <CardContent sx={{ pt: 0 }}>
                <InfoGrid>
                    <TitleWithValue
                        title="Номер накладной"
                        value={shipment.lading_number}
                        isLoading={isLoading}
                        copyable
                    />
                    <TitleWithValue
                        title="Отгружено"
                        value={convertMillisecondsToDate(shipment.author_date)}
                        isLoading={isLoading}
                    />
                    <TitleWithValue
                        title="Отгрузил"
                        value={
                            shipment.author
                                ? `${shipment.author.first_name} ${shipment.author.middle_name}`
                                : ""
                        }
                        isLoading={isLoading}
                    />
                    <TitleWithValue title="Получено" isLoading={isLoading}>
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            flexWrap="wrap"
                        >
                            {shipment.receiving_date && +shipment.receiving_date > 1 && (
                                <Typography variant="subtitle2">
                                    {convertMillisecondsToDate(shipment.receiving_date)}
                                </Typography>
                            )}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={received}
                                        onChange={(_, checked) => receivingChangeHandler(checked)}
                                        disabled={isLoading}
                                    />
                                }
                                label="Отметить как получено"
                            />
                        </Stack>
                    </TitleWithValue>
                    {shipment.receiving_author && (
                        <TitleWithValue
                            title="Получил"
                            value={`${shipment.receiving_author.first_name} ${shipment.receiving_author.middle_name}`}
                            isLoading={isLoading}
                        />
                    )}
                    {shipment.lading_file_path && (
                        <Box sx={{ gridColumn: { xs: "1 / -1", sm: "auto" } }}>
                            <TitleWithValue title="Накладная">
                                <Button
                                    startIcon={<DownloadIcon />}
                                    size="small"
                                    href={shipment.lading_file_path}
                                    target="_blank"
                                    variant="contained"
                                    color="success"
                                    fullWidth
                                    sx={{ textTransform: "none" }}
                                >
                                    Скачать ПП
                                </Button>
                            </TitleWithValue>
                        </Box>
                    )}
                </InfoGrid>
            </CardContent>
        </Card>
    );
};

export default memo(ShipmentShow);