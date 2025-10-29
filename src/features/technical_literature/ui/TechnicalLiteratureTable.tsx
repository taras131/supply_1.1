import {FC, useMemo, useCallback, memo, useState} from 'react';
import {Box, Stack, Typography, IconButton, Tooltip} from '@mui/material';
import {GridEventListener} from '@mui/x-data-grid';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import VerifiedIcon from '@mui/icons-material/Verified';
import {convertMillisecondsToDateWithTextMonths, formatDateDDMMYYYY} from "../../../utils/services";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {selectAllTechnicalLiterature, selectTechnicalLiteratureIsLoading} from "../model/selectors";
import EditableSelect from "../../../components/common/EditableSelect";
import {MyDataGrid} from "../../../styles/theme/customizations/MyDataGrid";
import {setCurrentLiterature} from "../model/slice";
import {selectCurrentUserId} from "../../users/model/selectors";
import ConfirmDeleteDialog from "../../../components/common/ConfirmDeleteDialog";
import * as React from "react";
import {fetchDeleteTechnicalLiterature} from "../model/actions";
import {fileServerPath} from "../../../api";

type TLiteratureFilter = 'all' | 'verified' | 'unverified' | 'popular';

const filterOptions: TLiteratureFilter[] = ['all', 'verified', 'unverified', 'popular'];
const filterOptionLabels: Record<TLiteratureFilter, string> = {
    all: 'Все',
    verified: 'Проверённые',
    unverified: 'Непроверённые',
    popular: 'Популярные',
};

interface IProps {
    filterValue?: TLiteratureFilter;
    filterChangeHandler?: (filter: TLiteratureFilter) => void;
}

// Колонки таблицы
const brandColumn = () => ({
    field: 'brand',
    headerName: 'Марка',
    flex: 0.5,

});

const modelColumn = () => ({
    field: 'model',
    headerName: 'Модель',
    flex: 0.7,
});

const literatureTypeColumn = () => ({
    field: 'literature_type_id',
    headerName: 'Тип',
    flex: 0.7,
    renderCell: (params: any) => {
        const typeMap: Record<number, string> = {
            1: 'Руководство по ремонту',
            2: 'Каталог запчастей',
            3: 'Руководство по эксплуатации',
            4: 'Схема электрическая',
            5: 'Схема гидравлическая',
            6: 'Техническое описание',
        };
        return typeMap[params.value] || `Тип ${params.value}`;
    },
});

const yearRangeColumn = () => ({
    field: 'year_range',
    headerName: 'Годы выпуска',
    width: 120,
    renderCell: (params: any) => `${params.row.year_from}-${params.row.year_to}`,
});

const languageColumn = () => ({
    field: 'language',
    headerName: 'Язык',
    width: 60,
});

const fileSizeColumn = () => ({
    field: 'file_size',
    headerName: 'Размер',
    width: 110,
    renderCell: (params: any) => {
        const sizeInMB = (params.value / 1024 / 1024).toFixed(2);
        return `${sizeInMB} МБ`;
    },
});

const pagesColumn = () => ({
    field: 'pages',
    headerName: 'Страниц',
    width: 75,
    renderCell: (params: any) => params.value || '-',
});

const ratingColumn = () => ({
    field: 'rating',
    headerName: 'Рейтинг',
    flex: 0.7,
    minWidth: 100,
    renderCell: (params: any) => {
        if (params.row.ratings_count === 0) return '-';
        return `${params.value.toFixed(1)}/5 (${params.row.ratings_count})`;
    },
});

const codeColumn = () => ({
    field: 'code',
    headerName: 'Код',
    minWidth: 80,
});

const downloadsColumn = () => ({
    field: 'downloads_count',
    headerName: 'Скачиваний',
    width: 95,
});

const createdDateColumn = () => ({
    field: 'created_at',
    headerName: 'Добавлена',
    width: 110,
    renderCell: (params: any) => formatDateDDMMYYYY(params.value),
});

const verifiedColumn = () => ({
    field: 'is_verified',
    headerName: 'Проверена',
    width: 100,
    renderCell: (params: any) => (
        params.value ? (
            <Tooltip title="Проверена модератором">
                <VerifiedIcon color="success"/>
            </Tooltip>
        ) : (
            <Typography variant="caption" color="warning.main">
                На проверке
            </Typography>
        )
    ),
});

const actionsColumn = (onDelete: (id: string, e: any) => void, currentUserId: string) => ({
    field: 'actions',
    headerName: 'Действия',
    width: 90,
    sortable: false,
    renderCell: (params: any) => (
        <Stack direction="row"
               spacing={0.5}
               sx={{width: '100%', height: '100%'}}
               alignItems={"center"}
               justifyContent={"start"}>
            <Tooltip title="Скачать">
                <IconButton
                    size="small"
                    href={`${fileServerPath}/${params.row.file_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                >
                    <DownloadIcon fontSize="small"/>
                </IconButton>
            </Tooltip>
            {currentUserId === params.row.author_id && (
                <Tooltip title="Удалить">
                    <IconButton
                        size="small"
                        onClick={(e) => onDelete(params.row, e)}
                        color="error"
                    >
                        <DeleteIcon fontSize="small"/>
                    </IconButton>
                </Tooltip>
            )}
        </Stack>
    ),
});

const TechnicalLiteratureTable: FC<IProps> = ({
                                                  filterValue = 'all',
                                                  filterChangeHandler,
                                              }) => {
    const dispatch = useAppDispatch();
    const rows = useAppSelector(selectAllTechnicalLiterature);
    const isLoading = useAppSelector(selectTechnicalLiteratureIsLoading);
    const currentUserId = useAppSelector(selectCurrentUserId);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [activeRowId, setActiveRowId] = useState<string | null>(null);
    const openDeleteDialog = (row: any, e: any) => {
        e.stopPropagation();
        setActiveRowId(row.id);
        setDeleteDialogOpen(true);
    };
    const closeDeleteDialog = useCallback(() => {
        setDeleteDialogOpen(false);
        setActiveRowId(null);
    }, []);
    const handleRowClick = useCallback<GridEventListener<"rowClick">>(
        ({row}) => {
            dispatch(setCurrentLiterature(row));
        },
        [dispatch],
    );
    // Адаптивные данные строк
    const adaptiveRows = useMemo(() => {
        if (!rows) return [];

        let filtered = rows;

        // Применяем фильтр
        switch (filterValue) {
            case 'verified':
                filtered = rows.filter((lit) => lit.is_verified);
                break;
            case 'unverified':
                filtered = rows.filter((lit) => !lit.is_verified);
                break;
            case 'popular':
                filtered = rows.filter((lit) => lit.downloads_count > 0);
                break;
            default:
                break;
        }

        return filtered;
    }, [rows, filterValue]);

    // Обработчик удаления
    const handleDelete = async () => {
        if (activeRowId) {
            await dispatch(fetchDeleteTechnicalLiterature(activeRowId))
            closeDeleteDialog();
            setActiveRowId(null);
        }
    };
    const columns = useMemo(
        () => [
            literatureTypeColumn(),
            brandColumn(),
            modelColumn(),
            codeColumn(),
            yearRangeColumn(),
            languageColumn(),
            fileSizeColumn(),
            pagesColumn(),
            downloadsColumn(),
            createdDateColumn(),
            verifiedColumn(),
            actionsColumn(openDeleteDialog, currentUserId || ""),
        ],
        [handleDelete]
    );
    return (
        <Box
            sx={{
                '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
                    outline: 'none',
                },
                '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within':
                    {
                        outline: 'none',
                    },
                position: 'relative',
            }}
        >
            {filterChangeHandler && (
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    sx={{position: 'absolute', left: 10, top: 10, zIndex: 3}}
                >
                    <Typography>Показать:</Typography>
                    <EditableSelect
                        value={filterValue}
                        onChange={filterChangeHandler}
                        options={filterOptions}
                        optionLabels={filterOptionLabels}
                        placeholder="Выберите"
                    />
                </Stack>
            )}
            <MyDataGrid
                tableName="technical_literature"
                rows={adaptiveRows}
                columns={columns}
                loading={isLoading}
                onRowClick={handleRowClick}
            />
            {deleteDialogOpen && (
                <ConfirmDeleteDialog
                    open={deleteDialogOpen}
                    loading={isLoading}
                    onClose={closeDeleteDialog}
                    onConfirm={handleDelete}
                    title="Точно удалить?"
                    description={"Вы уверены, что хотите удалить книгу? Это действие нельзя отменить."}
                />
            )}
        </Box>
    );
};

export default memo(TechnicalLiteratureTable);