import '@mui/x-data-grid';
declare module '@mui/x-data-grid' {
    // Расширяем пропсы тулбара, чтобы их можно было передавать через slotProps.toolbar
    interface ToolbarPropsOverrides {
        onAdd?: () => void;
        onDeleteSelected?: () => void;
        disableDelete?: boolean;
    }
}