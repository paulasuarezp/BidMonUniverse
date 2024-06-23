import { Logout } from '@mui/icons-material';
import { Menu, MenuItem } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetUser, setSocketConnected } from '../../../../redux/slices/userSlice';
import { RootState } from '../../../../redux/store';
import { disconnectSocket } from '../../../../socket/socketService';
import CoinsButton from '../../buttons/coins/CoinsButton';
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
export default function UserMenu({ anchorElUser, handleUserMenu, handleCloseUserMenu }: UserMenuProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sessionUser = useSelector((state: RootState) => state.user);
  const balance = useSelector((state: RootState) => state.user.balance);
  const isAuthenticated = sessionUser?.username ? true : false;

  const handleLoginClick = () => {
    navigate('/login');
  };


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
        <>
          <CoinsButton balance={balance} onClick={() => navigate('/recharge')} />
          <UserProfileButton
            name={sessionUser.username}
            imageUrl={sessionUser.profileImg}
            onClick={handleUserMenu} />
        </>
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
            <MenuItem onClick={handleCloseUserMenu}>Mi perfil</MenuItem>
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