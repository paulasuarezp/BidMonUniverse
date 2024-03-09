import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, MenuItem, IconButton } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ButtonLogin from '../../button/login/ButtonLogin';


//#region PROPS
interface UserMenuProps {
    auth: boolean;
    anchorElUser: null | HTMLElement;
    handleUserMenu: (event: React.MouseEvent<HTMLElement>) => void;
    handleCloseUserMenu: () => void;
  }
//#endregion
  

//#region COMPONENTE USER MENU
export default function UserMenu({ auth, anchorElUser, handleUserMenu, handleCloseUserMenu }: UserMenuProps) {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login'); 
    };

    return (
      <>
        {auth ? (
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
          {auth && (
            // Opciones del menú para usuario autenticado
            <MenuItem onClick={handleCloseUserMenu}>Mi perfil</MenuItem>
          )}
        </Menu>
      </>
    );
  };
  
//#endregion