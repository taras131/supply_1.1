import React, { FC } from 'react';
import { Box, Tooltip } from '@mui/material';

interface IProps {
    children: React.ReactNode;
    tooltipTitle?: string;
}
const IconWrapper: FC<IProps> = ({ children, tooltipTitle }) => {
    const hasTitle =
        tooltipTitle !== undefined && tooltipTitle !== null && String(tooltipTitle).trim() !== '';
    // Ровно один ребёнок-элемент для Tooltip
    const content = (
        <Box
            component="span"
            sx={{
                display: 'inline-flex',
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'auto', // на всякий случай для таблиц/контейнеров
            }}
        >
            {typeof children === 'string' ? <span>{children}</span> : children}
        </Box>
    );
    return (
        <Box
            sx={{
                height: '100%',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {hasTitle ? (
                <Tooltip title={tooltipTitle!} arrow>
                    {content}
                </Tooltip>
            ) : (
                content
            )}
        </Box>
    );
};
export default IconWrapper;