import React, {ChangeEvent, FC, memo} from 'react';
import Card from "@mui/material/Card";
import {IShipments} from "../../../models/iShipments";
import TitleWithValue from "../../../components/TitleWithValue";
import {convertMillisecondsToDate} from "../../../utils/services";
import {Button, ButtonGroup, CardHeader, Checkbox, Chip, FormControlLabel, Stack, Typography} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {selectCurrentUserId} from "../../users/model/selectors";
import {
    fetchAddShipmentPhotos,
    fetchChangeShipmentLadingFile,
    fetchDeleteShipmentPhoto,
    fetchUpdateShipment
} from "../model/actions";
import {selectShipmentsIsLoading} from "../model/selectors";
import DownloadIcon from "@mui/icons-material/Download";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import CardContent from "@mui/material/CardContent";
import {EditableSpan} from "../../../components/common/EditableSpan";
import ShipmentTypeIcon from "./ShipmentTypeIcon";
import MyButton from "../../../styles/theme/customizations/MyButton";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import {nestServerPath} from "../../../api";
import {PhotoGallery} from "../../../components/common/PhotoGallery";

interface IProps {
    shipment: IShipments | null;
}

const ShipmentShow: FC<IProps> = ({shipment}) => {
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
    const ladingNumberChangeHandler = (newValue: number | string) => {
        dispatch(fetchUpdateShipment({
            ...shipment,
            lading_number: `${newValue}`,
        }))
    }
    const handleChangeLandingFile = (e: ChangeEvent<HTMLInputElement>) => {
        const list = e.currentTarget.files;
        if (!list || !list[0]) return;
        dispatch(fetchChangeShipmentLadingFile({shipment, file: list[0]}));
    }
    const photosUploadHandler = (files: FileList) => {
        dispatch(fetchAddShipmentPhotos({shipment, files}));
    }
    const photoDeleteHandler = (index: number) => {
        dispatch(fetchDeleteShipmentPhoto({shipment, index}));
    }
    const photoFilePaths = shipment.photo_file_paths
        ? shipment.photo_file_paths.map(fileName => (`${nestServerPath}/static/${fileName}`))
        : []
    const received = shipment.receiving_is_receiving;
    return (
        <Card sx={{p: {xs: 1, sm: 2}, minHeight: 100}}>
            <CardHeader
                title={<Stack direction={"row"} spacing={2} alignItems={"center"}>
                    <Typography component="h2" variant="h5">
                        {shipment.transporter || "Перевозчик не указан"}
                    </Typography>
                    <ShipmentTypeIcon type={shipment.type}
                                      received={shipment.receiving_is_receiving}/>
                </Stack>}
                subheader={
                    <Stack direction="row" spacing={1} alignItems={"center"}>
                        <Typography variant={"subtitle1"}>№</Typography>
                        <EditableSpan value={shipment.lading_number}
                                      onChange={ladingNumberChangeHandler}
                                      maxWidth={250}/>

                    </Stack>}
                action={
                    <Chip
                        label={received ? "получено" : "в пути"}
                        color={received ? "success" : "warning"}
                    />
                }
                sx={{
                    pb: 1,
                    "& .MuiCardHeader-title": {fontWeight: 600},
                    "& .MuiCardHeader-subheader": {color: "text.secondary"},
                }}
            />
            <Divider sx={{mb: 2}}/>
            <CardContent sx={{pt: 0}}>
                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    columnGap: 3,
                    rowGap: 3,
                    alignItems: "start",
                }}>
                    <Stack spacing={2} sx={{height: "100%"}}>
                        <TitleWithValue
                            title="Отгружено:"
                            value={convertMillisecondsToDate(shipment.author_date)}
                            isLoading={isLoading}
                        />
                        <TitleWithValue
                            title="Отгрузил:"
                            value={
                                shipment.author
                                    ? `${shipment.author.first_name} ${shipment.author.middle_name}`
                                    : ""
                            }
                            isLoading={isLoading}
                        />
                        <TitleWithValue title="Получено:" isLoading={isLoading}>
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                flexWrap="wrap"
                            >
                                <FormControlLabel
                                    labelPlacement="start"
                                    control={
                                        <Checkbox
                                            checked={received}
                                            onChange={(_, checked) => receivingChangeHandler(checked)}
                                            disabled={isLoading}
                                        />
                                    }
                                    label={received ? "" : "Отметить как полученое"}
                                />
                                {received && !!shipment.receiving_date && (
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        {convertMillisecondsToDate(shipment.receiving_date)}
                                    </Typography>
                                )}
                            </Stack>
                        </TitleWithValue>
                        {shipment.receiving_author && (
                            <TitleWithValue
                                title="Получил:"
                                value={`${shipment.receiving_author.first_name} ${shipment.receiving_author.middle_name}`}
                                isLoading={isLoading}
                            />
                        )}
                        <Box
                            sx={{
                                position: "relative",
                                display: "flex",
                                alignItems: "end",
                                justifyContent: "end",
                                flexGrow: 1,
                            }}
                        >
                            <ButtonGroup fullWidth={false}>
                                <MyButton
                                    variant="contained"
                                    component="label"
                                    color={shipment.lading_file_path ? "warning" : "primary"}
                                    fullWidth
                                    startIcon={shipment.lading_file_path ? <AutorenewIcon/> : <FileUploadIcon/>}
                                    sx={{width: 220}}
                                >
                                    {shipment.lading_file_path ? "Заменить накладную" : "Загрузить накладную"}
                                    <input type="file" hidden onChange={handleChangeLandingFile}/>
                                </MyButton>
                                {shipment.lading_file_path && (
                                    <Button
                                        startIcon={<DownloadIcon/>}
                                        size="small"
                                        href={shipment.lading_file_path}
                                        target="_blank"
                                        variant="contained"
                                        color="success"
                                        fullWidth
                                        sx={{textTransform: "none", width: 220}}
                                    >
                                        Скачать накладную
                                    </Button>)}
                            </ButtonGroup>
                            <Typography variant="subtitle2" sx={{
                                position: "absolute",
                                right: 0,
                                bottom: -25,
                                color: "text.secondary"
                            }}>
                                {shipment.lading_file_path
                                    ? shipment.lading_file_path.split("/").reverse()[0].split("?")[0]
                                    : ""}
                            </Typography>
                        </Box>
                    </Stack>
                    <PhotoGallery
                        srcArr={photoFilePaths}
                        onUpload={photosUploadHandler}
                        onDelete={photoDeleteHandler}
                        height={280}
                        emptyStateText="Фотографии пока отсутствуют"
                        uploadButtonText="Загрузить фото"
                    />
                </Box>
            </CardContent>
        </Card>
    );
};

export default memo(ShipmentShow);