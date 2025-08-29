import React, {FC} from "react";
import {Stack, StackProps, Typography} from "@mui/material";
import {ROW, SPACE_BETWEEN} from "../styles/const";
import CircularProgress from "@mui/material/CircularProgress";

interface IProps extends StackProps {
    title: string;
    value?: string | number;
    children?: React.ReactNode;
    width?: string;
    isLoading?: boolean;
}

const TitleWithValue: FC<IProps> = ({title, value, children, sx, isLoading = false}) => {
    return (
        <Stack direction={ROW}
               alignItems="center"
               justifyContent={SPACE_BETWEEN}
               spacing={2}
               sx={{
                   height: "30px",
                   ...sx
               }}>
            <Typography color="gray" fontWeight={600}>
                {title}
            </Typography>
            {isLoading
                ? (<CircularProgress size="25px"/>)
                : (<> {value ? <Typography fontWeight={600}>{value}</Typography> : children} </>)}
        </Stack>
    );
};

export default TitleWithValue;
