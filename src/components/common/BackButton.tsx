import React, {useCallback} from 'react';
import {useNavigate} from "react-router-dom";
import {Button} from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const BackButton = () => {
    const navigate = useNavigate();
    const clickHandler = useCallback(() => {
        navigate(-1);
    }, [navigate]);
    return (
        <Button startIcon={<ArrowBackIosIcon/>}
                onClick={clickHandler}
                variant={"outlined"}
                sx={{color: 'text.primary', textTransform: 'none'}}>
            Назад
        </Button>
    );
};

export default BackButton;