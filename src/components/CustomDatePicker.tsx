import dayjs, {Dayjs} from 'dayjs';
import {useForkRef} from '@mui/material/utils';
import Button from '@mui/material/Button';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker, type DatePickerFieldProps} from '@mui/x-date-pickers/DatePicker';
import {useParsedFormat, usePickerContext, useSplitFieldProps} from '@mui/x-date-pickers';
import {useState} from 'react';
import {alpha, useTheme} from "@mui/material";

type ButtonFieldProps = DatePickerFieldProps;

function ButtonField(props: ButtonFieldProps) {
    const {forwardedProps} = useSplitFieldProps(props, 'date');
    const pickerContext = usePickerContext();
    const handleRef = useForkRef(pickerContext.triggerRef, pickerContext.rootRef);
    const parsedFormat = useParsedFormat();
    const valueStr =
        pickerContext.value == null
            ? parsedFormat
            : pickerContext.value.format(pickerContext.fieldFormat);
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    return (
        <Button
            {...forwardedProps}
            variant="outlined"
            ref={handleRef}
            size="small"
            startIcon={<CalendarTodayRoundedIcon fontSize="small"/>}
            onClick={() => pickerContext.setOpen((prev) => !prev)}
            sx={{
                minWidth: 'fit-content',
                bgcolor: isDark ? '#fff' : '#000',
                color: isDark ? '#000' : '#fff',
                borderColor: isDark ? alpha('#000', 0.2) : alpha('#fff', 0.3),
                '&:hover': {
                    bgcolor: isDark ? alpha('#fff', 0.9) : alpha('#000', 0.9),
                    borderColor: isDark ? alpha('#000', 0.3) : alpha('#fff', 0.4),
                },
            }}
        >
            {pickerContext.label ?? valueStr}
        </Button>
    );
}

export default function CustomDatePicker() {
    const [value, setValue] = useState<Dayjs | null>(dayjs('2023-04-17'));

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                value={value}
                label={value == null ? null : value.format('MMM DD, YYYY')}
                onChange={(newValue) => setValue(newValue)}
                slots={{field: ButtonField}}
                slotProps={{
                    nextIconButton: {size: 'small'},
                    previousIconButton: {size: 'small'},
                }}
                views={['day', 'month', 'year']}
            />
        </LocalizationProvider>
    );
}
