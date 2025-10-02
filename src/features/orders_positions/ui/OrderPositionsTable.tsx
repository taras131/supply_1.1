import * as React from 'react';
import {
    GridCellModesModel,
    GridColDef,
    useGridApiRef,
} from '@mui/x-data-grid';
import {Checkbox, IconButton, Tooltip, Typography} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {INewOrderPosition, IOrderPosition, unitMeasures} from "../../../models/IOrdersPositions";
import {FC, useCallback, useMemo, useState} from "react";
import {getNumberColumn} from "../../../components/dataGrid/numberColumn";
import {MyDataGrid} from "../../../styles/theme/customizations/MyDataGrid";
import MyButton from "../../../styles/theme/customizations/MyButton";
import AddIcon from "@mui/icons-material/Add";
import PhotoDialog from "./PhotoDialog";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CommentDialog from "./CommentDialog";
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import ConfirmDeleteDialog from "../../../components/common/ConfirmDeleteDialog";
import {EditableSpan} from "../../../components/common/EditableSpan";
import Box from "@mui/material/Box";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {catalogNumberColumn, countColumn, nameColumn} from "./Columns";
import {useNavigate} from "react-router-dom";
import {routes} from "../../../utils/routes";


interface IProps {
    orderId: string;
    title: string;
    rows: INewOrderPosition[] | IOrderPosition[];
    onRowsChange?: (newRow: INewOrderPosition | IOrderPosition) => void;
    handleAddRow?: () => void;
    loading?: boolean;
    addPhotoHandler?: (files: FileList, orderPositionId: string) => void;
    deletePhotoHandler?: (deletePhotoName: string, orderPositionId: string) => void;
    commentChangeHandler?: (newValue: string | number, orderPositionId: string) => void;
    deletePositionHandler?: (id: string) => void;
    titleChangeHandler?: (newValue: string | number) => void;
    selectable?: boolean;
    selectedIds?: string[];
    onToggleChecked?: (orderId: string, positionId: string) => void;
    isNewOrder?: boolean;
}

const OrderPositionsTable: FC<IProps> = ({
                                             orderId,
                                             title,
                                             rows,
                                             onRowsChange,
                                             handleAddRow,
                                             loading,
                                             addPhotoHandler,
                                             deletePhotoHandler,
                                             commentChangeHandler,
                                             deletePositionHandler,
                                             titleChangeHandler,
                                             selectable = false,
                                             selectedIds,
                                             onToggleChecked,
                                             isNewOrder = false,
                                         }) => {
    const apiRef = useGridApiRef();
    const navigate = useNavigate();
    const [cellModesModel, setCellModesModel] = useState<GridCellModesModel>({});
    const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
    const [commentDialogOpen, setCommentDialogOpen] = useState(false);
    const [deletePositionDialogOpen, setDeletePositionDialogOpen] = useState(false);
    const canEditInline = !!onRowsChange;
    const canManageComments = !!commentChangeHandler;
    const canManagePhotos = !!addPhotoHandler || !!deletePhotoHandler;
    const canDelete = !!deletePositionHandler;
    const [activeRowId, setActiveRowId] = useState<string | null>(null);
    const currentRow = useMemo(
        () => (activeRowId ? rows.find((r: any) => r.id === activeRowId) ?? null : null),
        [rows, activeRowId]
    );
    const photos = (Array.isArray((currentRow as any)?.photos) ? (currentRow as any).photos : []) as string[];
    const comment = ((currentRow as any)?.comment ?? "") as string;
    const getRowId = useCallback((row: any) => row.id, []);
    const openPhotosDialog = useCallback((row: any) => {
        setActiveRowId(row.id);
        setPhotoDialogOpen(true);
    }, []);
    const closePhotoDialog = useCallback(() => {
        setPhotoDialogOpen(false);
        setActiveRowId(null);
    }, []);
    const openCommentDialog = useCallback((row: any) => {
        setActiveRowId(row.id);
        setCommentDialogOpen(true);
    }, []);
    const closeCommentDialog = useCallback(() => {
        setCommentDialogOpen(false);
        setActiveRowId(null);
    }, []);
    const openDeletePositionDialog = useCallback((row: any) => {
        setActiveRowId(row.id);
        setDeletePositionDialogOpen(true);
    }, []);
    const closeDeletePositionDialog = useCallback(() => {
        setDeletePositionDialogOpen(false);
        setActiveRowId(null);
    }, []);
    const handleAddFiles = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.currentTarget.files;
            if (!files || !addPhotoHandler || activeRowId === null) return;
            addPhotoHandler(files, activeRowId);
        },
        [addPhotoHandler, activeRowId]
    );
    const handleDeletePhoto = useCallback(
        (src: string) => {
            if (!deletePhotoHandler || activeRowId === null) return;
            deletePhotoHandler(src, activeRowId);
        },
        [deletePhotoHandler, activeRowId]
    );
    const handleCommentChange = useCallback(
        (newValue: string | number) => {
            if (!commentChangeHandler || !activeRowId) return;
            commentChangeHandler(newValue, activeRowId);
        },
        [commentChangeHandler, activeRowId]
    );
    const handleConfirmDeletePosition = useCallback(() => {
        if (!activeRowId || !deletePositionHandler) return;
        const id = activeRowId;
        setActiveRowId(null); // сначала сбросить
        deletePositionHandler(id); // затем удалять
        closeDeletePositionDialog();
    }, [activeRowId, deletePositionHandler, closeDeletePositionDialog]);
    // Быстрый доступ к выбранным id — O(1) в ячейке, без includes
    const selectedIdsSet = useMemo(() => new Set(selectedIds ?? []), [selectedIds]);
    // Вынесите в мемо, если getNumberColumn дорого
    const numberCol = useMemo(() => getNumberColumn(apiRef), [apiRef]);
    const columns = useMemo<GridColDef[]>(() => {
        const base: GridColDef[] = [];
        if (selectable && onToggleChecked) {
            base.push({
                field: "selected",
                headerName: "Выбран",
                type: "boolean",
                disableColumnMenu: true,
                sortable: false,
                align: "center",
                headerAlign: "center",
                renderCell: (params: any) => {
                    const isChecked = selectedIdsSet.has(params.row.id);
                    const handleChange = () => onToggleChecked(orderId, params.row.id);
                    return (
                        <Checkbox
                            size="small"
                            checked={isChecked}
                            onChange={handleChange}
                            onClick={(e) => e.stopPropagation()}
                        />
                    );
                },
                flex: 0.25,
            });
        }
        if (!selectable && orderId !== "-1") {
            base.push({
                field: "invoice_id",
                headerName: "",
                width: 35,
                disableColumnMenu: true,
                editable: false,
                renderCell: (params: any) => (
                    <Tooltip title={params.row.invoice_id ? "Заказано" : "ещё не заказано"}>
                        <Box
                            sx={{display: "flex", alignItems: "center", justifyContent: "center", height: "100%"}}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {params.row.invoice_id ? <CheckCircleIcon color="success"/> :
                                <AccessTimeIcon color="warning"/>}
                        </Box>
                    </Tooltip>
                ),
            });
        }
        base.push(
            numberCol,
            nameColumn(canEditInline),
            catalogNumberColumn(canEditInline),
            countColumn(canEditInline),
            {
                field: "unit_measure",
                headerName: "Ед. изм.",
                width: 80,
                editable: canEditInline,
                type: "singleSelect",
                valueOptions: unitMeasures,
                disableColumnMenu: true,
                cellClassName: "editable-cell",
            }
        );
        if (canManageComments) {
            base.push({
                field: "comment",
                headerName: "Прим.",
                width: 60,
                sortable: false,
                filterable: false,
                align: "center",
                headerAlign: "center",
                disableColumnMenu: true,
                editable: false,
                renderCell: (params: any) => {
                    const isComment = ((params.row.comment ?? "") as string).length > 0;
                    return (
                        <Tooltip title={isComment ? "Посмотреть примечание" : "Добавить примечание"}>
              <span onClick={(e) => e.stopPropagation()}>
                <IconButton size="small" aria-label="Примечание" onClick={() => openCommentDialog(params.row)}>
                  <ModeCommentIcon color={isComment ? "primary" : "secondary"} fontSize="small"/>
                </IconButton>
              </span>
                        </Tooltip>
                    );
                },
                cellClassName: "editable-cell",
            });
        }
        if (canManagePhotos) {
            base.push({
                field: "photos",
                headerName: "Фото",
                width: 60,
                sortable: false,
                filterable: false,
                align: "center",
                headerAlign: "center",
                disableColumnMenu: true,
                editable: false,
                renderCell: (params: any) => {
                    const count = Array.isArray(params.row.photos) ? params.row.photos.length : 0;
                    return (
                        <Tooltip title="Открыть фото">
              <span onClick={(e) => e.stopPropagation()}>
                <IconButton size="small" aria-label="Фото" onClick={() => openPhotosDialog(params.row)}>
                  <PhotoCameraIcon color={count ? "primary" : "secondary"} fontSize="small"/>
                </IconButton>
              </span>
                        </Tooltip>
                    );
                },
                cellClassName: "editable-cell",
            });
        }
        if (!selectable && !isNewOrder) {
            base.push({
                field: "invoice",
                headerName: "Поставщик",
                width: 160,
                disableColumnMenu: true,
                editable: false,
                renderCell: (params: any) => {
                    const inv = params.row.invoice;
                    const clickHandler = () => {
                        navigate(`${routes.invoicesDetails.replace(':invoiceId', inv.id)}`);
                    }
                    return (
                        <Box sx={{display: "flex", height: "100%", alignItems: "center"}}
                             onClick={(e) => e.stopPropagation()}>
                            {inv ? (
                                <Tooltip title={`${inv.supplier.name} Счёт № ${inv.number}`}>
                  <span onClick={clickHandler} style={{cursor: "pointer"}}>
                    <Typography color="primary" variant="subtitle2">
                      {inv.supplier.name}
                    </Typography>
                  </span>
                                </Tooltip>
                            ) : (
                                <Typography color="warning" variant="subtitle2">
                                    Не заказано
                                </Typography>
                            )}
                        </Box>
                    );
                },
            });
        }
        if (canDelete) {
            base.push({
                field: "delete",
                headerName: "",
                width: 60,
                sortable: false,
                filterable: false,
                align: "center",
                disableColumnMenu: true,
                editable: false,
                renderCell: (params: any) => (
                    <Tooltip title={params.row.invoice_id ? "уже заказано" : "удалить"}>
            <span onClick={(e) => e.stopPropagation()}>
              <IconButton
                  size="small"
                  aria-label="Удалить"
                  disabled={!!params.row.invoice_id}
                  onClick={() => openDeletePositionDialog(params.row)}
              >
                <DeleteOutlineIcon color={params.row.invoice_id ? undefined : "warning"} fontSize="small"/>
              </IconButton>
            </span>
                    </Tooltip>
                ),
                cellClassName: "editable-cell",
            });
        }
        return base;
    }, [
        navigate,
        numberCol,
        selectable,
        onToggleChecked,
        selectedIdsSet,
        orderId,
        canEditInline,
        canManageComments,
        canManagePhotos,
        canDelete,
        isNewOrder,
        openCommentDialog,
        openPhotosDialog,
        openDeletePositionDialog,
    ]);
    const processRowUpdate = useCallback(
        (newRow: INewOrderPosition, oldRow: INewOrderPosition) => {
            const normalized: INewOrderPosition = {...oldRow, ...newRow, count: Number(newRow.count) || 0};
            onRowsChange?.(normalized);
            return normalized;
        },
        [onRowsChange]
    );
    return (
        <div style={{position: "relative"}}>
            {titleChangeHandler && (
                <Box sx={{position: "absolute", left: "10px", top: "10px", zIndex: 3}}>
                    <EditableSpan onChange={titleChangeHandler} value={title} label={"Добавить заголовок"}/>
                </Box>
            )}
            <MyDataGrid
                tableName={selectable ? "order_section" : "order_positions"}
                apiRef={apiRef}
                rows={rows}
                getRowId={getRowId}
                columns={columns}
                loading={loading}
                editMode="cell"
                cellModesModel={cellModesModel}
                onCellModesModelChange={setCellModesModel}
                processRowUpdate={processRowUpdate}
                disableRowSelectionOnClick
                showToolbar={!!onRowsChange}
            />
            {handleAddRow && (
                <MyButton
                    onClick={handleAddRow}
                    startIcon={<AddIcon sx={{fontSize: "var(--icon-fontSize-md)"}}/>}
                    sx={{position: "absolute", left: 10, bottom: 10}}
                >
                    Строка
                </MyButton>
            )}
            {canManagePhotos && photoDialogOpen && (
                <PhotoDialog
                    dialogOpen={photoDialogOpen}
                    closeDialog={closePhotoDialog}
                    handleAddFiles={handleAddFiles}
                    handleDeletePhoto={handleDeletePhoto}
                    photos={photos}
                />
            )}
            {canManageComments && commentDialogOpen && (
                <CommentDialog
                    dialogOpen={commentDialogOpen}
                    closeDialog={closeCommentDialog}
                    onChange={handleCommentChange}
                    comment={comment}
                />
            )}
            {canDelete && deletePositionDialogOpen && (
                <ConfirmDeleteDialog
                    open={deletePositionDialogOpen}
                    onClose={closeDeletePositionDialog}
                    onConfirm={handleConfirmDeletePosition}
                    title="Удалить позицию?"
                    description={
                        currentRow ? (
                            <>
                                Вы уверены, что хотите удалить
                                позицию <b>{(currentRow as any).name || "без наименования"}</b>
                                {(currentRow as any).catalog_number ? (
                                    <>
                                        {" "}
                                        (кат. № {(currentRow as any).catalog_number})
                                    </>
                                ) : null}
                                ?
                                <br/>
                                Это действие нельзя отменить.
                            </>
                        ) : (
                            <>Вы уверены, что хотите удалить позицию? Это действие нельзя отменить.</>
                        )
                    }
                />
            )}
        </div>
    );
};
export default React.memo(OrderPositionsTable);