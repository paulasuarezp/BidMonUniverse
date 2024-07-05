import { fireEvent, render, screen } from '@testing-library/react';
import Button from '../../views/components/buttons/Button';

test('renders button with text and responds to click events', () => {
    const handleClick = jest.fn();

    render(<Button label="Button" onClick={handleClick} />);

    const buttonElement = screen.getByText(/Button/i);
    expect(buttonElement).toBeInTheDocument();

    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
});
