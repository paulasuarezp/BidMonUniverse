import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { RootState } from '../../redux/store';
import UserMenu from '../../views/components/menus/userMenu/UserMenu';

const mockStore = configureStore([]);
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('UserMenu Component', () => {
    let store: ReturnType<typeof mockStore>;

    beforeEach(() => {
        const initialState: Partial<RootState> = {
            user: {
                username: null,
                profileImg: '',
                role: null,
                balance: 0,
                birthday: null,
                socketConnected: false,
            },
            _persist: {
                version: 1,
                rehydrated: true,
            },
        };
        store = mockStore(initialState);
    });

    test('should render login button for unauthenticated users and handle click', () => {
        render(
            <Provider store={store}>
                <Router>
                    <UserMenu anchorElUser={null} handleUserMenu={jest.fn()} handleCloseUserMenu={jest.fn()} />
                </Router>
            </Provider>
        );

        const loginButton = screen.getByLabelText(/Iniciar sesión/i);
        expect(loginButton).toBeInTheDocument();

        fireEvent.click(loginButton);
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
});
