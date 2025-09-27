import {unitMeasures} from "../../../models/IOrdersPositions";

export const rowNumberColumn = () => {
    return {
        field: "rowNumber",
        headerName: "№",
        width: 50,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params: any) => {
            return params.api.getRowIndexRelativeToVisibleRows(params.id) + 1;
        },
    };
};

export const nameColumn = (canEditInline: boolean = false) => {
    return ({
        field: "name",
        headerName: "Наименование",
        flex: 1,
        editable: canEditInline,
        disableColumnMenu: true,
        cellClassName: "editable-cell",
    })
}
export const catalogNumberColumn = (canEditInline: boolean = false) => {
    return ({
        field: "catalog_number",
        headerName: "Каталожный номер",
        flex: 0.75,
        editable: canEditInline,
        disableColumnMenu: true,
        cellClassName: "editable-cell",
    })
}

export const countColumn = (canEditInline: boolean = false) => {
    return ({
        field: "count",
        headerName: "Количество",
        width: 100,
        editable: canEditInline,
        disableColumnMenu: true,
        cellClassName: "editable-cell",
    })
}

export const unitMeasureColumn = (canEditInline: boolean = false) => {
    return ({
        field: "unit_measure",
        headerName: "Ед. изм.",
        width: 80,
        editable: canEditInline,
        type: "singleSelect",
        valueOptions: unitMeasures,
        disableColumnMenu: true,
        cellClassName: "editable-cell",
    })
}