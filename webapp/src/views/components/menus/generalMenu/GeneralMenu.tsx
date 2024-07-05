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

interface GeneralMenuProps {
  anchorGeneralMenu: null | HTMLElement;
  handleGeneralMenu: (event: React.MouseEvent<HTMLElement>) => void;
  handleGeneralMenuClose: () => void;
  toggleTheme?: () => void;
  tabIndex?: number;
}

export default function GeneralMenu({ anchorGeneralMenu, handleGeneralMenu, handleGeneralMenuClose, toggleTheme, tabIndex }: GeneralMenuProps) {
  const navigate = useNavigate();
  const [anchorElLang, setAnchorElLang] = React.useState<null | HTMLElement>(null);
  const theme = useTheme();
  const sessionUser = useSelector((state: RootState) => state.user);
  const isAdmin = sessionUser.role === 'admin';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
      <IconButton edge="start" color="inherit" aria-label="Abrir menú" onClick={handleGeneralMenu} tabIndex={tabIndex}>
        <MenuIcon sx={{ color: theme.palette.primary.contrastText }} />
      </IconButton>

      <Menu
        id="general-menu"
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
        MenuListProps={{
          'aria-labelledby': 'general-menu-button',
          role: 'menu',
        }}
      >
        <MenuItem onClick={handleNavigate('')} tabIndex={tabIndex + 1} role="menuitem" aria-label="Ir a Inicio">
          <ListItemIcon>
            <HomeIcon fontSize="small" sx={{ color: color }} />
          </ListItemIcon>
          <Typography>Inicio</Typography>
        </MenuItem>
        {!isAdmin &&
          <MenuItem onClick={handleNavigate('album')} tabIndex={tabIndex + 2} role="menuitem" aria-label="Ir a Mi colección">
            <ListItemIcon>
              <CollectionsIcon fontSize="small" sx={{ color: color }} />
            </ListItemIcon>
            <Typography>Mi colección</Typography>
          </MenuItem>
        }
        {!isAdmin &&
          <MenuItem onClick={handleNavigate('shop')} tabIndex={tabIndex + 3} role="menuitem" aria-label="Ir a Tienda">
            <ListItemIcon>
              <StoreIcon fontSize="small" sx={{ color: color }} />
            </ListItemIcon>
            <Typography>Tienda</Typography>
          </MenuItem>
        }
        <MenuItem onClick={handleNavigate('auctions')} tabIndex={tabIndex + 4} role="menuitem" aria-label="Ir a Subastas">
          <ListItemIcon>
            <GavelIcon fontSize="small" sx={{ color: color }} />
          </ListItemIcon>
          <Typography>Subastas</Typography>
        </MenuItem>
        <MenuItem onClick={handleNavigate('bids')} tabIndex={tabIndex + 5} role="menuitem" aria-label="Ir a Mis pujas">
          <ListItemIcon>
            <GavelIcon fontSize="small" sx={{ color: color }} />
          </ListItemIcon>
          <Typography>Mis pujas</Typography>
        </MenuItem>
        <MenuItem onClick={handleNavigate('transactions')} tabIndex={tabIndex + 6} role="menuitem" aria-label="Ir a Histórico de transacciones">
          <ListItemIcon>
            <HistoryIcon fontSize="small" sx={{ color: color }} />
          </ListItemIcon>
          <Typography>Histórico de transacciones</Typography>
        </MenuItem>

        {isMobile && (
          <Box>
            <Divider textAlign="right" sx={{ mt: 1, mb: 1 }}>
              <Chip label="Ajustes" size="small" />
            </Divider>
            <MenuItem onClick={handleGeneralMenuClose} tabIndex={tabIndex + 9} role="menuitem" aria-label="Cambiar tema">
              <ThemeSwitch toggleTheme={toggleTheme} tabIndex={tabIndex + 10} />
            </MenuItem>
          </Box>
        )}
      </Menu>
    </>
  );
};
