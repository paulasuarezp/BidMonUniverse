import { Logout } from '@mui/icons-material';
import { Box, Menu, MenuItem } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetUser, setSocketConnected } from '../../../../redux/slices/userSlice';
import { RootState } from '../../../../redux/store';
import { AccessLevel } from '../../../../shared/sharedTypes';
import { disconnectSocket } from '../../../../socket/socketService';
import CoinsButton from '../../buttons/coins/CoinsButton';
import InboxButton from '../../buttons/inbox/InboxButton';
import ButtonLogin from '../../buttons/login/ButtonLogin';
import UserProfileButton from '../../buttons/userProfile/UserProfileButton';


//#region PROPS
interface UserMenuProps {
  anchorElUser: null | HTMLElement;
  handleUserMenu: (event: React.MouseEvent<HTMLElement>) => void;
  handleCloseUserMenu: () => void;
}
//#endregion


//#region COMPONENTE USER MENU
// Menú de usuario
export default function UserMenu({ anchorElUser, handleUserMenu, handleCloseUserMenu }: UserMenuProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sessionUser = useSelector((state: RootState) => state.user);
  const balance = useSelector((state: RootState) => state.user.balance);
  const isAuthenticated = sessionUser?.username ? true : false;
  const isAdmin = sessionUser?.role === AccessLevel.Admin;

  /**
   * Función para redirigir al usuario a la página de inicio de sesión
   */
  const handleLoginClick = () => {
    navigate('/login');
  };

  /**
   * Función para cerrar sesión
   */
  const handleLogout = () => {
    // Cerrar menú de usuario
    handleCloseUserMenu();
    // Eliminar token de usuario
    localStorage.removeItem('userToken');
    // Reiniciar el estado del usuario
    dispatch(resetUser());
    // Limpiar el almacenamiento persistente
    localStorage.removeItem('persist:root');
    // Desconectar el socket
    disconnectSocket();
    dispatch(setSocketConnected(false));
    // Redirigir a la página de inicio
    navigate('/');

  }


  return (
    <>
      {isAuthenticated ? (
        <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
          {!isAdmin && <CoinsButton balance={balance} onClick={() => navigate('/recharge')} />}
          {!isAdmin && <InboxButton />}
          <UserProfileButton
            name={sessionUser.username}
            imageUrl={isAdmin ? '' : sessionUser.profileImg}
            onClick={handleUserMenu}
          />
        </Box>

      ) : (
        <ButtonLogin onClick={handleLoginClick} />
      )}
      <Menu
        id="menu-appbar-user"
        anchorEl={anchorElUser}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {isAuthenticated && (
          <div>
            {!isAdmin && <MenuItem onClick={handleCloseUserMenu}>Mi perfil</MenuItem>}
            <MenuItem onClick={handleLogout}>
              <Logout />
              Cerrar sesión
            </MenuItem>
          </div>
        )}
      </Menu>
    </>
  );
};
//#endregion