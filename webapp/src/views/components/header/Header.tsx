import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, MenuItem, Menu } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import TranslateIcon from '@mui/icons-material/Translate';
import ThemeSwitch from '../switch/ThemeSwitch';


//#region PROPS
interface HeaderProps {
  toggleTheme?: () => void; // Función que cambia el tema
}
//#endregion


//#region COMPONENTE HEADER
export default function Header({ toggleTheme }: HeaderProps) {
  const [auth, setAuth] = React.useState(true);
  const [anchorElLang, setAnchorElLang] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleLanguageMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElLang(event.currentTarget);
  };

  const handleUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseLanguageMenu = () => {
    setAnchorElLang(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <img src="/logo-sf.png" alt="Logo" style={{ marginLeft: 10, height: 60 }} />
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          BidMon Universe
        </Typography>
        <IconButton color="inherit" aria-label="change language" onClick={handleLanguageMenu}>
          <TranslateIcon />
        </IconButton>
        <Menu
          id="menu-appbar-language"
          anchorEl={anchorElLang}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElLang)}
          onClose={handleCloseLanguageMenu}
        >
          <MenuItem onClick={handleCloseLanguageMenu}>Español</MenuItem>
          <MenuItem onClick={handleCloseLanguageMenu}>English</MenuItem>
        </Menu>
        <ThemeSwitch toggleTheme={toggleTheme} />
        {auth && (
          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleUserMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
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
              <MenuItem onClick={handleCloseUserMenu}>Iniciar sesión</MenuItem>
            </Menu>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
}

//#endregion