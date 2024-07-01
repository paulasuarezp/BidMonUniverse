import { AppBar, Box, Grid, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import LogoBox from '../logoBox/LogoBox';
import GeneralMenu from '../menus/generalMenu/GeneralMenu';
import LanguageMenu from '../menus/languageMenu/LanguageMenu';
import UserMenu from '../menus/userMenu/UserMenu';
import ThemeSwitch from '../switch/ThemeSwitch';

//#region PROPS
interface HeaderProps {
  toggleTheme?: () => void;
}
//#endregion

//#region STYLES
const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'scrollbarWidth'
})<{ scrollbarWidth: number }>(({ theme, scrollbarWidth }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#c92918' : theme.palette.background.default,
  boxShadow: theme.palette.mode === 'light' ? 'default' : '0px 2px 6px rgba(255, 255, 255, 0.24)',
  borderRadius: '6em',
  left: 2,
  top: 5,
  position: 'fixed',
  width: `calc(100% - ${scrollbarWidth + 2}px)`,
}));

const ControlsContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  right: 5,
  top: 95,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));
//#endregion

//#region COMPONENTE HEADER
// Componente que muestra el encabezado de la aplicación
export default function Header({ toggleTheme }: HeaderProps) {
  const [anchorElLang, setAnchorElLang] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorGeneralMenu, setAnchorGeneralMenu] = useState<null | HTMLElement>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  useEffect(() => {
    const calculateScrollbarWidth = () => {
      const outer = document.createElement('div');
      outer.style.visibility = 'hidden';
      outer.style.overflow = 'scroll';
      document.body.appendChild(outer);
      const inner = document.createElement('div');
      outer.appendChild(inner);
      const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
      if (outer.parentNode) {
        outer.parentNode.removeChild(outer);
      }
      return scrollbarWidth;
    };

    setScrollbarWidth(calculateScrollbarWidth());
  }, []);

  /**
   * Función que maneja el menú de usuario
   * @param event 
   */
  const handleUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  /**
   * Función que cierra el menú de usuario
   */
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  /**
   * Función que maneja el menú de idioma
   * @param event 
   */
  const handleLanguageMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElLang(event.currentTarget);
  };

  /**
   * Función que cierra el menú de idioma
   * @param languageKey 
   */
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

  /**
   * Función que maneja el menú general
   * @param event 
   */
  const handleGeneralMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorGeneralMenu(event.currentTarget);
  };

  return (
    <>
      <StyledAppBar scrollbarWidth={scrollbarWidth} aria-label="Encabezado de la aplicación">
        <Toolbar>
          <Grid container alignItems="center" justifyContent="space-between">
            {isMobile ? (
              <>
                <Grid item xs={6} display="flex" alignItems="center">
                  <Box display="flex" alignItems="center" gap={1}>
                    <GeneralMenu
                      anchorGeneralMenu={anchorGeneralMenu}
                      handleGeneralMenu={handleGeneralMenu}
                      handleGeneralMenuClose={() => setAnchorGeneralMenu(null)}
                      toggleTheme={toggleTheme}
                      aria-label="Menú general"
                      tabIndex={0}
                    />
                    <LogoBox title="BidMon Universe" aria-label="Logo de BidMon Universe" tabIndex={1} />
                  </Box>
                </Grid>
                <Grid item xs={6} display="flex" justifyContent="flex-end">
                  <UserMenu
                    anchorElUser={anchorElUser}
                    handleUserMenu={handleUserMenu}
                    handleCloseUserMenu={handleCloseUserMenu}
                    aria-label="Menú de usuario"
                    tabIndex={2}
                  />
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={3}></Grid>
                <Grid item xs={6} display="flex" justifyContent="center">
                  <LogoBox title="BidMon Universe" aria-label="Logo de BidMon Universe" tabIndex={0} />
                </Grid>
                <Grid item xs={3} display="flex" justifyContent="flex-end">
                  <UserMenu
                    anchorElUser={anchorElUser}
                    handleUserMenu={handleUserMenu}
                    handleCloseUserMenu={handleCloseUserMenu}
                    aria-label="Menú de usuario"
                    tabIndex={1}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Toolbar>
      </StyledAppBar>
      {!isMobile && (
        <ControlsContainer>
          <LanguageMenu
            anchorElLang={anchorElLang}
            handleLanguageMenu={handleLanguageMenu}
            handleCloseLanguageMenu={handleCloseLanguageMenu}
            aria-label="Menú de idioma"
            tabIndex={2}
          />
          <ThemeSwitch toggleTheme={toggleTheme} aria-label="Interruptor para cambiar de tema" tabIndex={3} />
        </ControlsContainer>
      )}
    </>
  );
}
//#endregion
