import {FC, useMemo, useCallback, memo} from 'react';
import {Box, Stack, Typography, IconButton, Tooltip} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {GridEventListener} from '@mui/x-data-grid';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import VerifiedIcon from '@mui/icons-material/Verified';
import {convertMillisecondsToDateWithTextMonths} from "../../../utils/services";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {selectAllTechnicalLiterature, selectTechnicalLiteratureIsLoading} from "../model/selectors";
import EditableSelect from "../../../components/common/EditableSelect";
import {MyDataGrid} from "../../../styles/theme/customizations/MyDataGrid";

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
    flex: 0.8,
    minWidth: 100,
});

const modelColumn = () => ({
    field: 'model',
    headerName: 'Модель',
    flex: 0.8,
    minWidth: 100,
});

const literatureTypeColumn = () => ({
    field: 'literature_type_id',
    headerName: 'Тип',
    flex: 0.7,
    minWidth: 120,
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
    flex: 0.9,
    minWidth: 120,
    renderCell: (params: any) => `${params.row.year_from}-${params.row.year_to}`,
});

const languageColumn = () => ({
    field: 'language',
    headerName: 'Язык',
    flex: 0.6,
    minWidth: 70,
});

const fileSizeColumn = () => ({
    field: 'file_size',
    headerName: 'Размер',
    flex: 0.7,
    minWidth: 100,
    renderCell: (params: any) => {
        const sizeInMB = (params.value / 1024 / 1024).toFixed(2);
        return `${sizeInMB} МБ`;
    },
});

const pagesColumn = () => ({
    field: 'pages',
    headerName: 'Страниц',
    flex: 0.6,
    minWidth: 70,
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

const downloadsColumn = () => ({
    field: 'downloads_count',
    headerName: 'Скачиваний',
    flex: 0.8,
    minWidth: 100,
});

const createdDateColumn = () => ({
    field: 'created_at',
    headerName: 'Добавлена',
    flex: 0.9,
    minWidth: 120,
    renderCell: (params: any) => convertMillisecondsToDateWithTextMonths(+params.value),
});

const verifiedColumn = () => ({
    field: 'is_verified',
    headerName: 'Проверена',
    flex: 0.7,
    minWidth: 100,
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

const actionsColumn = (onDelete: (id: string) => void) => ({
    field: 'actions',
    headerName: 'Действия',
    flex: 0.6,
    minWidth: 100,
    sortable: false,
    renderCell: (params: any) => (
        <Stack direction="row"
               spacing={0.5}
               sx={{width: '100%', height: '100%'}}
               alignItems={"center"}
               justifyContent={"center"}>
            <Tooltip title="Скачать">
                <IconButton
                    size="small"
                    href={params.row.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <DownloadIcon fontSize="small"/>
                </IconButton>
            </Tooltip>
            <Tooltip title="Удалить">
                <IconButton
                    size="small"
                    onClick={() => onDelete(params.row.id)}
                    color="error"
                >
                    <DeleteIcon fontSize="small"/>
                </IconButton>
            </Tooltip>
        </Stack>
    ),
});

const TechnicalLiteratureTable: FC<IProps> = ({
                                                  filterValue = 'all',
                                                  filterChangeHandler,
                                              }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const rows = useAppSelector(selectAllTechnicalLiterature);
    const isLoading = useAppSelector(selectTechnicalLiteratureIsLoading);

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
    const handleDelete = useCallback(
        (id: string) => {
            if (window.confirm('Вы уверены, что хотите удалить литературу?')) {
                /*dispatch(fetchDeleteTechnicalLiterature(id));*/
                console.log("remove")
            }
        },
        []
    );

    // Обработчик клика по строке
    const handleRowClick = useCallback<GridEventListener<'rowClick'>>(
        (params, event) => {
            /*const target = event.target as HTMLElement;
            const interactive = target.closest(
                'a, button, [role="button"], .MuiChip-root, [data-interactive="true"]'
            );
            if (interactive) return;

            const me = event as React.MouseEvent;
            if (
                me.button !== 0 ||
                me.ctrlKey ||
                me.metaKey ||
                me.shiftKey ||
                me.altKey
            )
                return;

            navigate(
                routes.literatureDetails.replace(':literatureId', params.row.id)
            );*/
            console.log("handleRowClick")
        },
        []
    );

    // Колонки таблицы
    const columns = useMemo(
        () => [
            brandColumn(),
            modelColumn(),
            literatureTypeColumn(),
            yearRangeColumn(),
            languageColumn(),
            fileSizeColumn(),
            pagesColumn(),
            ratingColumn(),
            downloadsColumn(),
            createdDateColumn(),
            verifiedColumn(),
            actionsColumn(handleDelete),
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
        </Box>
    );
};

export default memo(TechnicalLiteratureTable);