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


interface IProps {
    orderId: string;
    title: string;
    rows: INewOrderPosition[] | IOrderPosition[];
    onRowsChange?: (newRow: INewOrderPosition | IOrderPosition) => void;
    handleAddRow?: () => void;
    loading?: boolean;
    addPhotoHandler?: (file: File, orderPositionId: string) => void;
    deletePhotoHandler?: (deletePhotoName: string, orderPositionId: string) => void;
    commentChangeHandler?: (newValue: string | number, orderPositionId: string) => void;
    deletePositionHandler?: (id: string) => void;
    titleChangeHandler?: (newValue: string | number) => void;
    selectable?: boolean;
    selectedIds?: string[];
    onToggleChecked?: (orderId: string, positionId: string) => void;
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
                                         }) => {
    console.log("table render")
    const apiRef = useGridApiRef();
    const [cellModesModel, setCellModesModel] = useState<GridCellModesModel>({});
    const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
    const [commentDialogOpen, setCommentDialogOpen] = useState(false);
    const [deletePositionDialogOpen, setDeletePositionDialogOpen] = useState(false);
    const canEditInline = !!onRowsChange;
    const canManageComments = !!commentChangeHandler;
    const canManagePhotos = !!addPhotoHandler || !!deletePhotoHandler;
    const canDelete = !!deletePositionHandler;
    const [activeRow, setActiveRow] = useState<INewOrderPosition | IOrderPosition | null>(null);
    const getRowId = useCallback((row: any) => row.id, []);
    const activeRowFromRows = useMemo(() => {
        if (!activeRow) return null;
        return rows.find(r => r.id === activeRow.id) ?? activeRow;
    }, [rows, activeRow]);
    const openPhotosDialog = useCallback((row: any) => {
        setActiveRow(row);
        setPhotoDialogOpen(true);
    }, []);
    const closePhotoDialog = useCallback(() => {
        setPhotoDialogOpen(false);
        setActiveRow(null);
    }, []);
    const openCommentDialog = useCallback((row: any) => {
        setActiveRow(row);
        setCommentDialogOpen(true);
    }, []);
    const closeCommentDialog = useCallback(() => {
        setCommentDialogOpen(false);
        setActiveRow(null);
    }, []);
    const openDeletePositionDialog = useCallback((row: any) => {
        setActiveRow(row);
        setDeletePositionDialogOpen(true);
    }, []);
    const closeDeletePositionDialog = useCallback(() => {
        setDeletePositionDialogOpen(false);
        setActiveRow(null);
    }, []);
    const handleAddFiles = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.currentTarget.files?.[0];
        if (!file || !addPhotoHandler || !activeRow) return;
        addPhotoHandler(file, `${activeRow.id}`);
    }, [addPhotoHandler, activeRow]);
    const handleDeletePhoto = useCallback((src: string) => {
        if (!deletePhotoHandler || !activeRow) return;
        deletePhotoHandler(src, `${activeRow.id}`);
    }, [deletePhotoHandler, activeRow]);
    const handleCommentChange = useCallback((newValue: string | number) => {
        if (!commentChangeHandler || !activeRow) return;
        commentChangeHandler(newValue, `${activeRow.id}`);
    }, [commentChangeHandler, activeRow]);
    const handleConfirmDeletePosition = useCallback(() => {
        if (!activeRow || !deletePositionHandler) return;
        deletePositionHandler(`${activeRow.id}`);
        closeDeletePositionDialog();
    }, [activeRow, deletePositionHandler, closeDeletePositionDialog]);
    const columns = useMemo<GridColDef[]>(() => {
        const base: GridColDef[] = [];
        if (selectable && onToggleChecked) {
            base.push(
                {
                    field: 'id',
                    headerName: 'Выбран',
                    type: 'boolean',
                    disableColumnMenu: true,
                    sortable: false,
                    align: 'center',
                    headerAlign: 'center',
                    renderCell: (params: any) => (
                        <Checkbox
                            size="small"
                            checked={Boolean(selectedIds?.includes(params.row.id))} // всегда boolean
                            onChange={() => onToggleChecked(orderId, params.row.id)}
                            onPointerDown={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                        />
                    ),
                    flex: 0.25,
                },
            )
        }
        if (!selectable && orderId !== "-1") {
            base.push({
                field: 'invoice_id',
                headerName: '',
                width: 40,
                disableColumnMenu: true,
                editable: false,
                renderCell: (params: any) => (
                    <Tooltip title={params.row.invoice_id ? "Заказано" : "ещё не заказано"}>
                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%"
                        }}>
                            {params.row.invoice_id
                                ? (<CheckCircleIcon color={"success"}/>)
                                : (<AccessTimeIcon color={"warning"}/>)}
                        </Box>
                    </Tooltip>
                )
            })
        }
        base.push(
            getNumberColumn(apiRef),
            {
                field: 'name',
                headerName: 'Наименование',
                flex: 1,
                editable: canEditInline,
                disableColumnMenu: true,
                cellClassName: 'editable-cell',
            },
            {
                field: 'catalog_number',
                headerName: 'Каталожный номер',
                flex: 1,
                editable: canEditInline,
                disableColumnMenu: true,
                cellClassName: 'editable-cell',
            },
            {
                field: 'count',
                headerName: 'Количество',
                width: 140,
                type: 'number',
                editable: canEditInline,
                disableColumnMenu: true,
                cellClassName: 'editable-cell',
            },
            {
                field: 'unit_measure',
                headerName: 'Ед. изм.',
                width: 80,
                editable: canEditInline,
                type: 'singleSelect',
                valueOptions: unitMeasures,
                disableColumnMenu: true,
                cellClassName: 'editable-cell',
            }
        );
        if (canManageComments) {
            base.push({
                field: 'comment',
                headerName: 'Прим.',
                width: 60,
                sortable: false,
                filterable: false,
                align: 'center',
                headerAlign: 'center',
                disableColumnMenu: true,
                editable: false,
                renderCell: (params: any) => {
                    const isComment = (params.row.comment?.length ?? 0) > 0;
                    return (
                        <Tooltip title={isComment ? 'Посмотреть примечание' : 'Добавить примечание'}>
              <span onClick={(e) => e.stopPropagation()}>
                <IconButton size="small" aria-label="Примечание" onClick={() => openCommentDialog(params.row)}>
                  <ModeCommentIcon color={isComment ? 'primary' : 'secondary'} fontSize="small"/>
                </IconButton>
              </span>
                        </Tooltip>
                    );
                },
                cellClassName: 'editable-cell',
            });
        }
        if (canManagePhotos) {
            base.push({
                field: 'photos',
                headerName: 'Фото',
                width: 60,
                sortable: false,
                filterable: false,
                align: 'center',
                headerAlign: 'center',
                disableColumnMenu: true,
                editable: false,
                renderCell: (params: any) => {
                    const count = params.row.photos?.length ?? 0;
                    return (
                        <Tooltip title="Открыть фото">
              <span onClick={(e) => e.stopPropagation()}>
                <IconButton size="small" aria-label="Фото" onClick={() => openPhotosDialog(params.row)}>
                  <PhotoCameraIcon color={count ? 'primary' : 'secondary'} fontSize="small"/>
                </IconButton>
              </span>
                        </Tooltip>
                    );
                },
                cellClassName: 'editable-cell',
            });
        }
        if (!selectable) {
            base.push({
                field: 'invoice',
                headerName: 'Поставщик',
                width: 160,
                disableColumnMenu: true,
                editable: false,
                renderCell: (params: any) => {
                    return (
                        <Box sx={{display: "flex", height: "100%", alignItems: "center"}}>
                            {params.row.invoice
                                ? (
                                    <Tooltip
                                        title={`${params.row.invoice.supplier.name} Счёт № ${params.row.invoice.number}`}>
                                        <span onClick={(e) => e.stopPropagation()}>
                                            <Typography color={"primary"} variant={"subtitle2"}>
                                                {params.row.invoice.supplier.name}
                                            </Typography>
                                        </span>
                                    </Tooltip>
                                )
                                : (<Typography color={"warning"} variant={"subtitle2"}>
                                    Не заказано
                                </Typography>)}
                        </Box>
                    );
                },
            })
        }

        if (canDelete) {
            base.push({
                field: 'delete',
                headerName: '',
                width: 60,
                sortable: false,
                filterable: false,
                align: 'center',
                disableColumnMenu: true,
                editable: false,
                renderCell: (params: any) => (
                    <Tooltip title={!!params.row.invoice_id ? "уже заказано" : "удалить"}>
                         <span onClick={(e) => e.stopPropagation()}>
                        <IconButton
                            size="small"
                            aria-label="Удалить"
                            disabled={!!params.row.invoice_id}
                            onClick={(e) => {
                                e.stopPropagation();
                                openDeletePositionDialog(params.row);
                            }}
                        >
                            <DeleteOutlineIcon color={!!params.row.invoice_id ? undefined : "warning"}
                                               fontSize="small"/>
                        </IconButton>
                             </span>
                    </Tooltip>
                ),
                cellClassName: 'editable-cell',
            });
        }
        return base;
    }, [apiRef,
        canEditInline,
        canManageComments,
        canManagePhotos,
        canDelete,
        openCommentDialog,
        openPhotosDialog,
        openDeletePositionDialog,
        onToggleChecked,
        selectable,
        selectedIds,
        orderId
    ]);
    const processRowUpdate = useCallback((newRow: INewOrderPosition, oldRow: INewOrderPosition) => {
        const normalized: INewOrderPosition = {...oldRow, ...newRow, count: Number(newRow.count) || 0};
        onRowsChange?.(normalized);
        return normalized;
    }, [onRowsChange]);
    const photos = rows.filter(row => row.id === activeRow?.id)[0]
        ? rows.filter(row => row.id === activeRow?.id)[0].photos
        : []
    const comment = rows.filter(row => row.id === activeRow?.id)[0]
        ? rows.filter(row => row.id === activeRow?.id)[0].comment
        : ""
    return (
        <div style={{position: "relative"}}>
            {titleChangeHandler
                && (<Box sx={{position: "absolute", left: "10px", top: "10px", zIndex: 3}}>
                    <EditableSpan
                        onChange={titleChangeHandler}
                        value={title}
                        label={"Добавить заголовок"}
                    />
                </Box>)}
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
                <MyButton onClick={handleAddRow} startIcon={<AddIcon sx={{fontSize: 'var(--icon-fontSize-md)'}}/>}
                          sx={{position: 'absolute', left: 10, bottom: 10}}>
                    Строка
                </MyButton>
            )}
            {canManagePhotos && (
                <PhotoDialog
                    dialogOpen={photoDialogOpen}
                    closeDialog={closePhotoDialog}
                    handleAddFiles={handleAddFiles}
                    handleDeletePhoto={handleDeletePhoto}
                    photos={photos}
                />
            )}
            {canManageComments && (
                <CommentDialog
                    dialogOpen={commentDialogOpen}
                    closeDialog={closeCommentDialog}
                    onChange={handleCommentChange}
                    comment={comment}
                />
            )}
            {canDelete && (
                <ConfirmDeleteDialog
                    open={deletePositionDialogOpen}
                    onClose={closeDeletePositionDialog}
                    onConfirm={handleConfirmDeletePosition}
                    title="Удалить позицию?"
                    description={
                        activeRowFromRows ? (
                            <>
                                Вы уверены, что хотите удалить
                                позицию <b>{activeRowFromRows.name || 'без наименования'}</b>
                                {activeRowFromRows.catalog_number ? <> (кат.
                                    № {activeRowFromRows.catalog_number})</> : null}?
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