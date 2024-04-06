import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { birthdayDatePickerTheme } from '../../../themes';


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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
            label="Fecha de nacimiento"
            onChange={props.onChange}
            slotProps={{
                textField: {
                    helperText: errrorMessage? errrorMessage : ' ',
                },
              }}
              minDate={minDate}
              maxDate={maxDate}
              views={['year', 'month', 'day']}
            />
        </LocalizationProvider>
        </ThemeProvider>
    );
  }