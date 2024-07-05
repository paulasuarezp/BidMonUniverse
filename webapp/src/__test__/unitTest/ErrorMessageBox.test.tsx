import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ErrorMessageBox from '../../views/components/messages/ErrorMessageBox';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('ErrorMessageBox Component', () => {

    test('should navigate to home page when button is clicked', () => {
        const errorMessage = 'Test error message';
        render(
            <Router>
                <ErrorMessageBox message={errorMessage} />
            </Router>
        );


        const button = screen.getByText(/volver a la página principal/i);
        expect(button).toBeInTheDocument();

        fireEvent.click(button);
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});
