import React, {useMemo, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TablePagination, TableRow, useTheme} from "@mui/material";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import {ITableColumn} from "../../models/ITable";

interface BaseTableProps<T> {
    rows: T[];
    columns: ITableColumn<T>[];
    renderCustomRow?: (row: T) => React.ReactNode;
    minWidth?: string;
    onRowClick?: (row: T) => void;
    activeRowId?: number | null;
}

const BaseTable = <T extends { id: number | string }>({
                                                          rows,
                                                          columns,
                                                          renderCustomRow,
                                                          minWidth = "800px",
                                                          onRowClick,
                                                          activeRowId,
                                                      }: BaseTableProps<T>) => {
    const theme = useTheme();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handlePageChange = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedRows = useMemo(() => {
        const start = page * rowsPerPage;
        return rows.slice(start, start + rowsPerPage);
    }, [rows, page, rowsPerPage]);

    const renderRow = (row: T) => {
        if (renderCustomRow) {
            return renderCustomRow(row);
        }
        return (
            <TableRow
                key={row.id}
                hover={!!onRowClick && row.id !== activeRowId}
                onClick={() => onRowClick?.(row)}
                sx={{
                    cursor: onRowClick ? "pointer" : "default",
                    backgroundColor: row.id === activeRowId ? theme.palette.info.main : "transparent",
                    "& .MuiTableCell-root": {
                        color:
                            row.id === activeRowId
                                ? "white" // Белый текст, если строка активная
                                : "inherit", // Наследование, если строка не активна
                    },
                }}
            >
                {columns
                    .filter((column) => !column.isHidden)
                    .map((column) => {
                        const value = column.getValue
                            ? column.getValue(row)
                            : row[column.key as keyof T];
                        return (
                            <TableCell key={`${row.id}-${column.key}`} style={{width: column.width}}>
                                {column.formatter ? column.formatter(value, row) : value}
                            </TableCell>
                        );
                    })}
            </TableRow>
        );
    };
    return (
        <Card>
            <Box sx={{overflowX: "auto"}}>
                <Table sx={{minWidth}}>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.key} style={{width: column.width}}>
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>{paginatedRows.map(renderRow)}</TableBody>
                </Table>
            </Box>
            <Divider/>
            <TablePagination
                component="div"
                count={rows.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </Card>
    );
};

export default BaseTable;
