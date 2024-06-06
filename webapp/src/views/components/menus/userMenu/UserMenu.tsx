import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, MenuItem, IconButton } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ButtonLogin from '../../buttons/login/ButtonLogin';
import { Logout } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { resetUser } from '../../../../redux/slices/userSlice';


//#region PROPS
interface UserMenuProps {
    anchorElUser: null | HTMLElement;
    handleUserMenu: (event: React.MouseEvent<HTMLElement>) => void;
    handleCloseUserMenu: () => void;
  }
//#endregion
  

//#region COMPONENTE USER MENU
export default function UserMenu({anchorElUser, handleUserMenu, handleCloseUserMenu }: UserMenuProps) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const sessionUser = useSelector((state: RootState) => state.user);
    let isAuthenticated = sessionUser?.username ? true : false;
    
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
        // Redirigir a la página de inicio
        navigate('/');

    }

    return (
      <>
        {isAuthenticated ? (
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleUserMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        ) : (
          <ButtonLogin onClick={handleLoginClick} />
        )}
        <Menu
          id="menu-appbar-user"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          {isAuthenticated && (
            // Opciones del menú para usuario autenticado
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
  
//#endregion