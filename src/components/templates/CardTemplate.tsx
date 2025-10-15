import React, {FC} from 'react';
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import {Stack} from "@mui/material";

interface IProps {
    title?: string;
    children?: React.ReactNode;
}

const CardTemplate: FC<IProps> = ({title, children}) => {
    return (
        <Card
            sx={{
                position: "relative",
                padding: "24px",
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                height: "100%",
            }}
        >
            {title && (
                <Typography sx={{marginBottom: "36px", fontSize: 20, fontWeight: 600}}
                            variant="h5"
                            color="primary">
                    {title}
                </Typography>
            )}
            <Stack sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}>
                {children}
            </Stack>
        </Card>
    );
};

export default CardTemplate;