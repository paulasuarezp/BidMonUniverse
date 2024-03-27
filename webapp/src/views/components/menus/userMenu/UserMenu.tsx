import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, MenuItem, IconButton } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ButtonLogin from '../../button/login/ButtonLogin';
import { Logout } from '@mui/icons-material';
import {useAuth} from '../../../../utils/AuthContext';


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
    const { sessionUser, logout } = useAuth();

    console.log('auth -->', sessionUser)
    
    
    const handleLoginClick = () => {
        navigate('/login'); 
    };

    const handleLogout = () => {
        logout();
        handleCloseUserMenu();
    }

    return (
      <>
        {sessionUser ? (
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
          {sessionUser && (
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