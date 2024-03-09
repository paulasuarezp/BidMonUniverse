// MobileMenu.js
import React, { useEffect } from 'react';
import { Menu, MenuItem, IconButton, Box, Chip, Divider, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LanguageMenu from '../languageMenu/LanguageMenu';
import ThemeSwitch from '../../switch/ThemeSwitch';
import { useTranslation } from 'react-i18next';

//#region PROPS
interface GeneralMenuProps {
    anchorGeneralMenu: null | HTMLElement;
    handleGeneralMenu: (event: React.MouseEvent<HTMLElement>) => void;
    handleGeneralMenuClose: () => void;
    toggleTheme?: () => void;
  }
//#endregion

//#region COMPONENTE GENERAL MENU
export default function GeneralMenu ({ anchorGeneralMenu, handleGeneralMenu, handleGeneralMenuClose, toggleTheme}: GeneralMenuProps) {
  
    const [anchorElLang, setAnchorElLang] = React.useState<null | HTMLElement>(null);
    const { i18n } = useTranslation();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    
  const handleLanguageMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElLang(event.currentTarget);
  };

  // Language menu handlers
  const handleCloseLanguageMenu = (languageKey:string) => {
    i18n.changeLanguage(languageKey);
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

  
    return (
        <>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleGeneralMenu}>
             <MenuIcon/>
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
        <MenuItem onClick={handleGeneralMenuClose}>
        Prueba de menú general
      </MenuItem>

        { isMobile && (
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