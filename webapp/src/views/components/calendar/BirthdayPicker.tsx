import { ThemeProvider, useTheme } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { birthdayDatePickerTheme } from '../../../themes';

dayjs.extend(localizedFormat);
dayjs.locale('es'); // Configura dayjs para usar el idioma español

interface BirthdayDatePickerProps {
    onChange: (date: any) => void;
    error?: string;
}

export default function BirthdayDatePicker(props: BirthdayDatePickerProps) {
    const minDate = dayjs().subtract(120, 'year'); // Mínimo hace 120 años
    const maxDate = dayjs().subtract(18, 'year'); // Máximo hace 18 años
    const errrorMessage = props.error;

    const datePickerTheme = birthdayDatePickerTheme(useTheme());

    return (
        <ThemeProvider theme={datePickerTheme}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                <DatePicker
                    label="Fecha de nacimiento"
                    onChange={props.onChange}
                    slotProps={{
                        textField: {
                            helperText: errrorMessage ? errrorMessage : ' ',
                            FormHelperTextProps: {
                                error: !!errrorMessage,
                                'aria-live': 'assertive',
                            },
                        },
                        layout: {
                            sx: {
                                margin: 'dense',
                            },
                        },
                    }}
                    minDate={minDate}
                    maxDate={maxDate}
                    views={['year', 'month', 'day']}
                    format="DD/MM/YYYY" // Formato de fecha
                />
            </LocalizationProvider>
        </ThemeProvider>
    );
}
