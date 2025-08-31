import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    List, ListItem, ListItemIcon, ListItemText, Button, Stack, Chip
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";


type UploadStatus = "success" | "error" | "skip";

export interface UploadResult {
    fileName: string;
    amount?: number | null;
    status: UploadStatus;
    message: string;
}


const PaymentUploadResultDialog = ({
                                       open,
                                       onClose,
                                       results,
                                   }: {
    open: boolean;
    onClose: () => void;
    results: UploadResult[];
}) => {
    const successCount = results.filter(r => r.status === "success").length;
    const errorCount = results.filter(r => r.status === "error").length;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Итоги загрузки платежных поручений</DialogTitle>
            <DialogContent dividers>
                <Stack direction="row" spacing={2} mb={2}>
                    <Chip color="success" label={`Успехов: ${successCount}`}/>
                    <Chip color="error" label={`Ошибок: ${errorCount}`}/>
                </Stack>
                <List dense>
                    {results.map((r, idx) => (
                        <ListItem key={`${r.fileName}-${idx}`} alignItems="flex-start">
                            <ListItemIcon>
                                {r.status === "success" ? (
                                    <CheckCircleIcon color="success"/>
                                ) : (
                                    <ErrorIcon color="error"/>
                                )}
                            </ListItemIcon>
                            <ListItemText
                                primary={`${r.fileName}${r.amount != null ? ` — ${r.amount} руб.` : ""}`}
                                secondary={r.message}
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained">Ок</Button>
            </DialogActions>
        </Dialog>
    );
};

export default PaymentUploadResultDialog;