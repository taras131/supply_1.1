import * as React from 'react';
import {
    GridCellModesModel,
    useGridApiRef,
} from '@mui/x-data-grid';
import {IconButton, Tooltip} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {INewOrderPosition, IOrderPosition, unitMeasures} from "../../../models/IOrdersPositions";
import {FC, useCallback, useState} from "react";
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


interface IProps {
    title: string;
    rows: INewOrderPosition[] | IOrderPosition[];
    onRowsChange: (newRow: INewOrderPosition | IOrderPosition) => void;
    handleAddRow: () => void;
    loading?: boolean;
    addPhotoHandler?: (file: File, orderPositionId: string) => void;
    deletePhotoHandler?: (deletePhotoName: string, orderPositionId: string) => void;
    commentChangeHandler?: (newValue: string | number, orderPositionId: string) => void;
    deletePositionHandler?: (id: string) => void;
    titleChangeHandler: (newValue: string | number) => void;
}

const OrderPositionsTable: FC<IProps> = ({
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
                                         }) => {
    const apiRef = useGridApiRef();
    const [cellModesModel, setCellModesModel] = useState<GridCellModesModel>({});
    const [photoDialogOpen, setPhotoDialogOpen] = React.useState(false);
    const [commentDialogOpen, setCommentDialogOpen] = React.useState(false);
    const [deletePositionDialogOpen, setDeletePositionDialogOpen] = React.useState(false);
    const [activeRow, setActiveRow] = React.useState<INewOrderPosition | IOrderPosition | null>(null);
    const openPhotosDialog = (row: any) => {
        setActiveRow(row);
        setPhotoDialogOpen(true);
    };
    const closePhotoDialog = () => {
        setPhotoDialogOpen(false);
        setActiveRow(null);
    };
    const openCommentDialog = (row: any) => {
        setActiveRow(row);
        setCommentDialogOpen(true);
    };
    const closeCommentDialog = () => {
        setCommentDialogOpen(false);
        setActiveRow(null);
    };
    const openDeletePositionDialog = (row: any) => {
        setActiveRow(row);
        setDeletePositionDialogOpen(true);
    };
    const closeDeletePositionDialog = () => {
        setDeletePositionDialogOpen(false);
        setActiveRow(null);
    };
    const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.currentTarget.files?.[0];
        if (!file || !addPhotoHandler || !activeRow) return;
        addPhotoHandler(file, `${activeRow.id}`)
    };
    const handleDeletePhoto = (src: string) => {
        if (!deletePhotoHandler || !activeRow) return;
        deletePhotoHandler(src, `${activeRow.id}`)
    };
    const handleCommentChange = (newValue: string | number) => {
        if (!commentChangeHandler || !activeRow) return;
        commentChangeHandler(newValue, `${activeRow.id}`)
    }
    const handleConfirmDeletePosition = async () => {
        if (!activeRow || !deletePositionHandler) return;
        deletePositionHandler(`${activeRow.id}`);
        closeDeletePositionDialog();
    };
    const columns = React.useMemo<any>(() => [
        getNumberColumn(apiRef),
        {
            field: 'name',
            headerName: 'Наименование',
            flex: 1,
            editable: true,
            disableColumnMenu: true,
            cellClassName: 'editable-cell',
        },
        {
            field: 'catalog_number',
            headerName: 'Каталожный номер',
            flex: 1,
            editable: true,
            disableColumnMenu: true,
            cellClassName: 'editable-cell',
        },
        {
            field: 'count',
            headerName: 'Количество',
            width: 140,
            type: 'number',
            editable: true,
            disableColumnMenu: true,
            renderCell: (params: any) => params.row.count,
            cellClassName: 'editable-cell',
        },
        {
            field: 'unit_measure',
            headerName: 'Ед. изм.',
            width: 60,
            editable: true,
            type: 'singleSelect',
            valueOptions: unitMeasures,
            renderCell: (params: any) => params.row.unit_measure,
            disableColumnMenu: true,
            cellClassName: 'editable-cell',
        },
        {
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
                const isComment = params.row.comment.length > 0
                return (
                    <Tooltip title={isComment
                        ? "Посмотреть примечание"
                        : "Добавить примечание"}>
                        <span onClick={(e) => e.stopPropagation()}>
              <IconButton
                  size="small"
                  aria-label="Примечание"
                  onClick={() => openCommentDialog(params.row)}
              >
                  <ModeCommentIcon color={isComment ? "primary" : "secondary"} fontSize="small"/>
              </IconButton>
            </span>
                    </Tooltip>
                );
            },
            cellClassName: 'editable-cell',
        },
        {
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
                            <IconButton
                                size="small"
                                aria-label="Фото"
                                onClick={() => openPhotosDialog(params.row)}
                            >
                            <PhotoCameraIcon color={count ? "primary" : "secondary"} fontSize="small"/>
                            </IconButton>
                        </span>
                    </Tooltip>
                );
            },
            cellClassName: 'editable-cell',
        },
        {
            field: 'delete',
            headerName: '',
            width: 60,
            sortable: false,
            filterable: false,
            align: 'center',
            disableColumnMenu: true,
            renderCell: (params: any) => (
                <IconButton
                    size="small"
                    aria-label="Удалить"
                    onClick={(e) => {
                        e.stopPropagation();
                        openDeletePositionDialog(params.row);
                    }}
                >
                    <DeleteOutlineIcon color={"warning"} fontSize="small"/>
                </IconButton>
            ),
            cellClassName: 'editable-cell',
        }
    ], [rows, onRowsChange]);
    const processRowUpdate = useCallback((newRow: INewOrderPosition, oldRow: INewOrderPosition) => {
        const normalized: INewOrderPosition = {
            ...oldRow,
            ...newRow,
            count: Number(newRow.count) || 0,
        };
        onRowsChange(normalized);
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
            <Box sx={{position: "absolute", left: "10px", top: "10px", zIndex: 3}}>
                <EditableSpan
                    onChange={titleChangeHandler}
                    value={title}
                    label={"Добавить заголовок"}
                />
            </Box>
            <MyDataGrid
                tableName={"orderPositions"}
                apiRef={apiRef}
                rows={rows}
                getRowId={(row) => row.id}
                columns={columns}
                loading={loading}
                editMode="cell"
                cellModesModel={cellModesModel}
                onCellModesModelChange={setCellModesModel}
                processRowUpdate={processRowUpdate}
                disableRowSelectionOnClick
            />
            <MyButton
                onClick={handleAddRow}
                startIcon={<AddIcon sx={{fontSize: "var(--icon-fontSize-md)"}}/>}
                sx={{position: "absolute", left: "10px", bottom: "10px"}}
            >
                Строка
            </MyButton>
            <PhotoDialog dialogOpen={photoDialogOpen}
                         closeDialog={closePhotoDialog}
                         handleAddFiles={handleAddFiles}
                         handleDeletePhoto={handleDeletePhoto}
                         photos={photos}/>
            <CommentDialog dialogOpen={commentDialogOpen}
                           closeDialog={closeCommentDialog}
                           onChange={handleCommentChange}
                           comment={comment}
            />
            <ConfirmDeleteDialog
                open={deletePositionDialogOpen}
                onClose={closeDeletePositionDialog}
                onConfirm={handleConfirmDeletePosition}
                title="Удалить позицию?"
                description={
                    activeRow ? (
                        <>
                            Вы уверены, что хотите удалить позицию{" "}
                            <b>{activeRow?.name || "без наименования"}</b>
                            {activeRow?.catalog_number ? <> (кат. № {activeRow?.catalog_number})</> : null}
                            ?
                            <br/>
                            Это действие нельзя отменить.
                        </>
                    ) : (
                        <>Вы уверены, что хотите удалить позицию? Это действие нельзя отменить.</>
                    )
                }
            />
        </div>
    );
};

export default OrderPositionsTable;