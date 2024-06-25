// MobileMenu.js
import MenuIcon from '@mui/icons-material/Menu';
import { Box, Chip, Divider, IconButton, Menu, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../../../redux/store';
import ThemeSwitch from '../../switch/ThemeSwitch';
import LanguageMenu from '../languageMenu/LanguageMenu';
//#region PROPS
interface GeneralMenuProps {
  anchorGeneralMenu: null | HTMLElement;
  handleGeneralMenu: (event: React.MouseEvent<HTMLElement>) => void;
  handleGeneralMenuClose: () => void;
  toggleTheme?: () => void;
}
//#endregion

//#region COMPONENTE GENERAL MENU
export default function GeneralMenu({ anchorGeneralMenu, handleGeneralMenu, handleGeneralMenuClose, toggleTheme }: GeneralMenuProps) {
  const navigate = useNavigate();
  const [anchorElLang, setAnchorElLang] = React.useState<null | HTMLElement>(null);
  const theme = useTheme();
  const sessionUser = useSelector((state: RootState) => state.user);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));


  const handleLanguageMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElLang(event.currentTarget);
  };

  // Language menu handlers
  const handleCloseLanguageMenu = (languageKey: string) => {
    setAnchorElLang(null);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (anchorElLang && !anchorElLang.contains(event.target as HTMLElement)) {
        setAnchorElLang(null);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [anchorElLang]);

  const handleNavigate = (route: string) => () => {
    handleGeneralMenuClose();
    if (sessionUser.role === 'admin')
      navigate(`/admin/${route}`)
    else
      navigate(`/${route}`);
  }


  return (
    <>
      <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleGeneralMenu}>
        <MenuIcon />
      </IconButton>

      <Menu
        anchorEl={anchorGeneralMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorGeneralMenu)}
        onClose={handleGeneralMenuClose}
      >
        <MenuItem onClick={handleNavigate('')}>
          Inicio
        </MenuItem>
        <MenuItem onClick={handleNavigate('album')}>
          Mi colección
        </MenuItem>
        <MenuItem onClick={handleNavigate('shop')}>
          Tienda
        </MenuItem>
        <MenuItem onClick={handleNavigate('auctions')}>
          Subastas
        </MenuItem>
        <MenuItem onClick={handleNavigate('bids')}>

          Mis pujas
        </MenuItem>
        <MenuItem onClick={handleNavigate('transactions')}>
          Histórico de transacciones
        </MenuItem>


        {isMobile && (
          <Box>
            <Divider textAlign="right">
              <Chip label="Ajustes" size="small" />
            </Divider>
            <MenuItem>
              <LanguageMenu
                anchorElLang={anchorElLang}
                handleLanguageMenu={handleLanguageMenu}
                handleCloseLanguageMenu={handleCloseLanguageMenu}
                texto='Cambiar idioma'
              />
            </MenuItem>
            <MenuItem onClick={handleGeneralMenuClose}>
              <ThemeSwitch toggleTheme={toggleTheme} />
            </MenuItem>
          </Box>
        )}
      </Menu>
    </>

  );
};
//#endregion