import * as React from 'react';
import {
    GridCellModesModel,
    useGridApiRef,
} from '@mui/x-data-grid';
import {IconButton, Tooltip, Badge} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {INewOrderPosition, IOrderPosition, unitMeasures} from "../../../models/IOrdersPositions";
import {FC, useCallback, useState} from "react";
import {getNumberColumn} from "../../../components/dataGrid/numberColumn";
import {MyDataGrid} from "../../../styles/theme/customizations/MyDataGrid";
import MyButton from "../../../styles/theme/customizations/MyButton";
import AddIcon from "@mui/icons-material/Add";
import PhotoDialog from "./PhotoDialog";
import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined';


interface IProps {
    rows: INewOrderPosition[] | IOrderPosition[];
    onRowsChange: (newRow: INewOrderPosition | IOrderPosition) => void;
    handleAddRow: () => void;
    loading?: boolean;
    addPhotoHandler?: (file: File, orderPositionId: string) => void;
}

const OrderPositionsTable: FC<IProps> = ({
                                             rows,
                                             onRowsChange,
                                             handleAddRow,
                                             loading,
                                             addPhotoHandler,
                                         }) => {
    const [photoDialogOpen, setPhotoDialogOpen] = React.useState(false);
    const [activeRowId, setActiveRowId] = React.useState<null>(null);
    const openPhotosDialog = (row: any) => {
        setActiveRowId(row.id);
        setPhotoDialogOpen(true);
    };
    const closeDialog = () => {
        setPhotoDialogOpen(false);
        setActiveRowId(null);
    };
    const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.currentTarget.files?.[0];
        if (!file || !addPhotoHandler || !activeRowId) return;
        addPhotoHandler(file, activeRowId)
    };
    const handleDeletePhoto = (idx: number) => {

    };
    const handleSavePhotos = async () => {

        closeDialog();
    };
    const apiRef = useGridApiRef();
    const [cellModesModel, setCellModesModel] = useState<GridCellModesModel>({});
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
            width: 140,
            editable: true,
            type: 'singleSelect',
            valueOptions: unitMeasures,
            renderCell: (params: any) => params.row.unit_measure,
            disableColumnMenu: true,
            cellClassName: 'editable-cell',
        },
        {
            field: 'photos',
            headerName: 'Фото',
            width: 90,
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
                        {/* span нужен, чтобы Tooltip работал и чтобы стопнуть всплытие */}
                        <span onClick={(e) => e.stopPropagation()}>
              <IconButton
                  size="small"
                  aria-label="Фото"
                  onClick={() => openPhotosDialog(params.row)}
              >
                <Badge
                    color="primary"
                    badgeContent={count}
                    showZero
                    max={99}
                >
                  <PhotoLibraryOutlinedIcon fontSize="small"/>
                </Badge>
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
                >
                    <DeleteOutlineIcon fontSize="small"/>
                </IconButton>
            ),
            cellClassName: 'editable-cell',
        },
    ], [rows, onRowsChange]);
    const processRowUpdate = useCallback((newRow: INewOrderPosition, oldRow: INewOrderPosition) => {
        const normalized: INewOrderPosition = {
            ...oldRow,
            ...newRow,
            count: Number(newRow.count) || 0, // если нужно
        };
        onRowsChange(normalized);
        return normalized;
    }, [onRowsChange]);
    const photos = rows.filter(row => row.id === activeRowId)[0]
        ? rows.filter(row => row.id === activeRowId)[0].photos
        : []
    return (
        <div style={{position: "relative"}}>
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
            <PhotoDialog photoDialogOpen={photoDialogOpen}
                         closeDialog={closeDialog}
                         handleAddFiles={handleAddFiles}
                         handleDeletePhoto={handleDeletePhoto}
                         handleSavePhotos={handleSavePhotos}
                         photos={photos}/>
        </div>
    );
};

export default OrderPositionsTable;