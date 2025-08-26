import React, {FC} from 'react';
import {Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import MyButton from "../../../styles/theme/customizations/MyButton";
import AddIcon from "@mui/icons-material/Add";
import {useNavigate} from "react-router-dom";

interface IProps {
    isValid: boolean;
    saveClickHandler: () => void;
}

const InvoiceAddNewPageHeader:FC<IProps> = ({isValid, saveClickHandler}) => {
    const navigate = useNavigate();
    return (
        <Stack direction="row"
               spacing={3}
               justifyContent="space-between"
               alignItems="center"
               sx={{mb: 2, mt: 2}}>
            <Typography component="h2" variant="h6">
                Новый счёт
            </Typography>
            <Stack direction="row" spacing={1}>
                <MyButton variant="outlined" onClick={() => navigate(-1)}>
                    Назад
                </MyButton>
                <MyButton
                    startIcon={<AddIcon sx={{fontSize: "var(--icon-fontSize-md)"}}/>}
                    variant="contained"
                    onClick={saveClickHandler}
                    disabled={!isValid}
                >
                    Сохранить
                </MyButton>
            </Stack>
        </Stack>
    );
};

export default InvoiceAddNewPageHeader;