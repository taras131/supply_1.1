import {Tabs, Tab, type TabsProps, type TabProps} from '@mui/material';

export const MyTabs = (props: TabsProps) => {
    return (
        <Tabs
            {...props}
            sx={[
                {
                    minHeight: 'fit-content',
                    '& .MuiTabs-indicator': (theme) => ({
                        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[200] : theme.palette.grey[800],
                    }),
                },
            ]}
        />
    );
}
export const MyTab = (props: TabProps) => {
    return (
        <Tab
            disableRipple
            {...props}
            sx={[
                (theme) => ({
                    padding: '6px 8px',
                    mb: 1,
                    textTransform: 'none',
                    minWidth: 'fit-content',
                    minHeight: 'fit-content',
                    color: 'text.secondary',
                    borderRadius: theme.shape.borderRadius,
                    border: '1px solid transparent',
                    '&:hover': {
                        color: 'text.primary',
                        bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
                    },
                    '&.Mui-selected': {
                        color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.grey[900],
                    },
                }),
            ]}
        />
    );
}