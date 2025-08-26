import React, {FC} from 'react';
import {Stack, Typography} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MyButton from "../../../styles/theme/customizations/MyButton";

interface IProps {
    handleAddClick: () => void;
}

const SuppliersPageHeader: FC<IProps> = ({
                                             handleAddClick,
                                         }) => {
    return (
        <Stack direction="row"
               spacing={3}
               justifyContent="space-between"
               alignItems="center"
               sx={{mb: 2, mt: 2}}>
            <Typography component="h2" variant="h6">
                Поставщики
            </Typography>
            <MyButton onClick={handleAddClick}
                      startIcon={<AddIcon sx={{fontSize: "var(--icon-fontSize-md)"}}/>}
                      variant="contained">
                Добавить
            </MyButton>
        </Stack>
    );
};

export default SuppliersPageHeader;
