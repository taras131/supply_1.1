import React, {FC} from 'react';
import {Stack} from "@mui/material";
import Typography from "@mui/material/Typography";

interface IProps {
    title: string;
    children?: React.ReactNode;
}

const PageHeaderTemplate: FC<IProps> = ({title, children}) => {
    return (
        <Stack direction="row"
               spacing={3}
               justifyContent="space-between"
               alignItems="center">
            <Typography component="h2" variant="h6">
                {title}
            </Typography>
            {children}
        </Stack>
    );
};

export default PageHeaderTemplate;