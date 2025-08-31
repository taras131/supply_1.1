import React, {FC, useMemo} from "react";
import {Stack, StackProps, Typography} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {useAppDispatch} from "../hooks/redux";
import {setMessage} from "../features/messages/model/slice";
import {MESSAGE_SEVERITY} from "../utils/const";


interface IProps {
    title: string;
    value?: string | number;
    children?: React.ReactNode;
    width?: string;
    isLoading?: boolean;
    copyable?: boolean;         // показывать иконку копирования
    copyText?: string;          // явный текст для копирования (если нужен)
    onCopy?: (text: string) => void; // опциональный колбэк после копирования
    hideCopyIfUnsupported?: boolean;
}

const TitleWithValue: FC<IProps> = ({
                                        title,
                                        value,
                                        children,
                                        isLoading = false,
                                        copyable = false,
                                        copyText,
                                        onCopy,
                                        hideCopyIfUnsupported = true,
                                    }) => {
    const dispatch = useAppDispatch();
    const textToCopy = useMemo(() => {
        if (typeof copyText === "string" && copyText.length > 0) return copyText;
        if (value !== undefined && value !== null) return String(value);
        if (typeof children === "string" || typeof children === "number") {
            return String(children);
        }
        return "";
    }, [copyText, value, children]);
    const isClipboardAvailable =
        typeof window !== "undefined" &&
        typeof navigator !== "undefined" &&
        !!navigator.clipboard?.writeText &&
        // HTTPS или localhost — true
        window.isSecureContext === true;
    const canShowCopyIcon =
        copyable &&
        !!textToCopy &&
        !isLoading &&
        (hideCopyIfUnsupported ? isClipboardAvailable : true);
    const notifySuccess = () =>
        dispatch(
            setMessage({
                severity: MESSAGE_SEVERITY.success,
                text: "Текст скопирован в буфер обмена",
            })
        );
    const notifyError = (text?: string) =>
        dispatch(
            setMessage({
                severity: MESSAGE_SEVERITY.error,
                text: text ?? "Не удалось скопировать текст",
            })
        );
    const handleCopy = async () => {
        if (!textToCopy) return;
        // Если API недоступен — показываем понятное сообщение и выходим
        if (!isClipboardAvailable) {
            notifyError(
                "Копирование недоступно в этом окружении (нужен HTTPS и поддержка Clipboard API)."
            );
            return;
        }
        try {
            await navigator.clipboard.writeText(textToCopy);
            notifySuccess();
            onCopy?.(textToCopy);
        } catch {
            notifyError();
        }
    };

    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
            sx={{height: "30px"}}
        >
            <Typography color="gray" fontWeight={600}>
                {title}
            </Typography>
            {isLoading ? (
                <CircularProgress size="25px"/>
            ) : (
                <Stack direction="row" alignItems="center" spacing={1}>
                    {value !== undefined && value !== null ? (
                        <Typography fontWeight={600}>{value}</Typography>
                    ) : (
                        children
                    )}
                    {canShowCopyIcon && (
                        <Tooltip title="Скопировать">
                            <IconButton
                                size="small"
                                onClick={handleCopy}
                                aria-label="Скопировать"
                                edge="end"
                            >
                                <ContentCopyIcon fontSize="inherit"/>
                            </IconButton>
                        </Tooltip>
                    )}
                </Stack>
            )}
        </Stack>
    );
};

export default TitleWithValue;
