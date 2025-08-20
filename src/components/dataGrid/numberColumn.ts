export const getNumberColumn = (apiRef: any) => ({
    field: '__rowNumber__',
    headerName: '#',
    width: 64,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    align: 'center' as const,
    headerAlign: 'center' as const,
    renderCell: (params: any) => {
        const api: any = apiRef.current;
        // индекс строки среди видимых (с учётом сорт/фильтра)
        let idx =
            typeof api?.getRowIndexRelativeToVisibleRows === 'function'
                ? api.getRowIndexRelativeToVisibleRows(params.id)
                : typeof api?.getRowIndex === 'function'
                    ? api.getRowIndex(params.id)
                    : 0;
        // скорректируем под текущую страницу (чтобы на странице начиналось с 1)
        const page = api?.state?.pagination?.paginationModel?.page ?? 0;
        const pageSize = api?.state?.pagination?.paginationModel?.pageSize ?? 0;
        if (pageSize > 0) {
            const start = page * pageSize;
            return idx - start + 1;
        }
        return idx + 1;
    },
});