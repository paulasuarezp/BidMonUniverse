import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import BirthdayDatePicker from '../../views/components/calendar/BirthdayPicker';

const renderWithProviders = (ui: React.ReactElement) => {
    const theme = createTheme();
    return render(
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                {ui}
            </LocalizationProvider>
        </ThemeProvider>
    );
};

test('renders DatePicker with correct label', () => {
    renderWithProviders(<BirthdayDatePicker onChange={() => { }} />);
    const labelElement = screen.getByLabelText(/fecha de nacimiento/i);
    expect(labelElement).toBeInTheDocument();
});

test('displays error message when error prop is passed', () => {
    const errorMessage = 'Invalid date';
    renderWithProviders(<BirthdayDatePicker onChange={() => { }} error={errorMessage} />);
    const errorElement = screen.getByText(errorMessage);
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveAttribute('aria-live', 'assertive');
});

test('calls onChange when date is selected', () => {
    const handleChange = jest.fn();
    renderWithProviders(<BirthdayDatePicker onChange={handleChange} />);

    const dateInput = screen.getByLabelText(/fecha de nacimiento/i);
    fireEvent.change(dateInput, { target: { value: '01/01/2000' } });

    // Simula el evento de cambio del DatePicker
    expect(handleChange).toHaveBeenCalled();
});
