// MobileMenu.tsx
import CollectionsIcon from '@mui/icons-material/Collections';
import GavelIcon from '@mui/icons-material/Gavel';
import HistoryIcon from '@mui/icons-material/History';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import StoreIcon from '@mui/icons-material/Store';
import {
  Box, Chip, Divider, IconButton,
  ListItemIcon,
  Menu, MenuItem,
  Typography,
  useMediaQuery, useTheme
} from '@mui/material';
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
    if (sessionUser.role === 'admin') {
      navigate(`/admin/${route}`);
    } else {
      navigate(`/${route}`);
    }
  };

  let color = theme.palette.mode === 'dark' ? theme.palette.primary.contrastText : '#000000';

  return (
    <>
      <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleGeneralMenu}>
        <MenuIcon sx={{ color: theme.palette.primary.contrastText }} />
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
        PaperProps={{
          elevation: 3,
          sx: {
            width: '100%',
            maxWidth: 320,
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }
        }}
      >
        <MenuItem onClick={handleNavigate('')}>
          <ListItemIcon>
            <HomeIcon fontSize="small" sx={{ color: color }} />
          </ListItemIcon>
          <Typography variant="inherit">Inicio</Typography>
        </MenuItem>
        <MenuItem onClick={handleNavigate('album')}>
          <ListItemIcon>
            <CollectionsIcon fontSize="small" sx={{ color: color }} />
          </ListItemIcon>
          <Typography variant="inherit">Mi colección</Typography>
        </MenuItem>
        <MenuItem onClick={handleNavigate('shop')}>
          <ListItemIcon>
            <StoreIcon fontSize="small" sx={{ color: color }} />
          </ListItemIcon>
          <Typography variant="inherit">Tienda</Typography>
        </MenuItem>
        <MenuItem onClick={handleNavigate('auctions')}>
          <ListItemIcon>
            <GavelIcon fontSize="small" sx={{ color: color }} />
          </ListItemIcon>
          <Typography variant="inherit">Subastas</Typography>
        </MenuItem>
        <MenuItem onClick={handleNavigate('bids')}>
          <ListItemIcon>
            <GavelIcon fontSize="small" sx={{ color: color }} />
          </ListItemIcon>
          <Typography variant="inherit">Mis pujas</Typography>
        </MenuItem>
        <MenuItem onClick={handleNavigate('transactions')}>
          <ListItemIcon>
            <HistoryIcon fontSize="small" sx={{ color: color }} />
          </ListItemIcon>
          <Typography variant="inherit">Histórico de transacciones</Typography>
        </MenuItem>

        {isMobile && (
          <Box>
            <Divider textAlign="right" sx={{ mt: 1, mb: 1 }}>
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
