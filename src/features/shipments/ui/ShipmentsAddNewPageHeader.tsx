import React, {FC} from 'react';
import {Stack} from "@mui/material";
import MyButton from "../../../styles/theme/customizations/MyButton";
import AddIcon from "@mui/icons-material/Add";
import {useNavigate} from "react-router-dom";
import PageHeaderTemplate from "../../../components/templates/PageHeaderTemplate";
import BackButton from "../../../components/common/BackButton";

interface IProps {
    isValid: boolean;
    saveClickHandler: () => void;
}

const ShipmentsAddNewPageHeader: FC<IProps> = ({isValid, saveClickHandler}) => {
    const navigate = useNavigate();
    return (
        <PageHeaderTemplate title={"Новая отгрузка"}>
            <Stack direction="row" spacing={1}>
                <BackButton/>
                <MyButton
                    startIcon={<AddIcon sx={{fontSize: "var(--icon-fontSize-md)"}}/>}
                    variant="contained"
                    onClick={saveClickHandler}
                    disabled={!isValid}
                >
                    Сохранить
                </MyButton>
            </Stack>
        </PageHeaderTemplate>
    );
};

export default ShipmentsAddNewPageHeader;