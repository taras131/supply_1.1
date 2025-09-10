import React from 'react';
import Typography from "@mui/material/Typography";
import {Stack} from "@mui/material";
import MyButton from "../../../styles/theme/customizations/MyButton";
import {useNavigate} from "react-router-dom";
import {routes} from "../../../utils/routes";

const ProblemDetailsPageHeader = () => {
    const navigate = useNavigate();
    const backClickHandler = () => {
        navigate(-1)
    }
    return (
        <Stack direction="row"
               spacing={3}
               justifyContent="space-between"
               alignItems="center"
               sx={{mb: 2, mt: 2}}>
            <Typography component="h2" variant="h6">
                Проблема
            </Typography>
                <MyButton
                    variant="contained"
                    onClick={backClickHandler}
                >
                    Назад
                </MyButton>
        </Stack>
    );
};

export default ProblemDetailsPageHeader;

