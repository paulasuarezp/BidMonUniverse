import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Box, Grid, useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import ThemeSwitch from '../switch/ThemeSwitch';
import LanguageMenu from '../menus/languageMenu/LanguageMenu';
import UserMenu from '../menus/userMenu/UserMenu';
import LogoBox from '../logoBox/LogoBox';
import GeneralMenu from '../menus/generalMenu/GeneralMenu';

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

  const handleUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLanguageMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElLang(event.currentTarget);
  };

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

  const handleGeneralMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorGeneralMenu(event.currentTarget);
  };

  return (
    <>
      <StyledAppBar scrollbarWidth={scrollbarWidth}>
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
                    />
                    <LogoBox title="BidMon Universe" />
                  </Box>
                </Grid>
                <Grid item xs={6} display="flex" justifyContent="flex-end">
                  <UserMenu
                    anchorElUser={anchorElUser}
                    handleUserMenu={handleUserMenu}
                    handleCloseUserMenu={handleCloseUserMenu}
                  />
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={3}>
                  <GeneralMenu
                    anchorGeneralMenu={anchorGeneralMenu}
                    handleGeneralMenu={handleGeneralMenu}
                    handleGeneralMenuClose={() => setAnchorGeneralMenu(null)}
                    toggleTheme={toggleTheme}
                  />
                </Grid>
                <Grid item xs={6} display="flex" justifyContent="center">
                  <LogoBox title="BidMon Universe" />
                </Grid>
                <Grid item xs={3} display="flex" justifyContent="flex-end">
                  <UserMenu
                    anchorElUser={anchorElUser}
                    handleUserMenu={handleUserMenu}
                    handleCloseUserMenu={handleCloseUserMenu}
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
          />
          <ThemeSwitch toggleTheme={toggleTheme} />
        </ControlsContainer>
      )}
    </>
  );
}
//#endregion
