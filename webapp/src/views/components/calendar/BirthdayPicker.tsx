import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


interface BirthdayDatePickerProps {
    onChange: (date: any) => void;
    error?: string;
  }
  

export default function BirthdayDatePicker(props: BirthdayDatePickerProps) {
    const minDate = dayjs().subtract(120, 'year'); // Mínimo hace 120 años
    const maxDate = dayjs().subtract(18, 'year'); // Máximo hace 18 años
    const errrorMessage = props.error;
  

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
            label="Fecha de nacimiento"
            onChange={props.onChange}
            slotProps={{
                textField: {
                    helperText: errrorMessage? errrorMessage : ' ',
                },
                layout: {
                    sx: {
                      color: '#ad1457',
                      borderRadius: '12px',
                      borderWidth: '0px',
                      borderColor: '#e91e63',
                      border: '0px solid',
                      backgroundColor: '#f48fb1',
                    }
                  }
              }}
              minDate={minDate}
              maxDate={maxDate}
              views={['year', 'month', 'day']}
            />
        </LocalizationProvider>
    );
  }