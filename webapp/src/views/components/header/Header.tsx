import React, { useEffect } from 'react';
import { AppBar, Toolbar, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ThemeSwitch from '../switch/ThemeSwitch';
import { useTranslation } from 'react-i18next';
import LanguageMenu from '../menus/languageMenu/LanguageMenu';
import UserMenu from '../menus/userMenu/UserMenu';
import LogoBox from '../logoBox/LogoBox';
import { styled } from '@mui/material/styles';



//#region PROPS
interface HeaderProps {
  toggleTheme?: () => void; // Función que cambia el tema
}
//#endregion

//#region STYLES
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#c92918' : theme.palette.background.default,
  boxShadow: theme.palette.mode === 'light' ? 'default' : '0px 2px 6px rgba(255, 255, 255, 0.24)',
  borderRadius: '6em',
  top: 5, // Fija el AppBar en la parte superior
  position: 'fixed', // Fija el AppBar en la parte superior
}));


const ControlsContainer = styled(Box)(({ theme }) => ({
  position: 'fixed', // Fija el contenedor en la posición deseada
  right: 0, // Alinea el contenedor a la derecha
  top: 95, // Ajusta este valor según la altura de tu AppBar
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2), // Espaciado entre los elementos
}));
//#endregion


//#region COMPONENTE HEADER
export default function Header({ toggleTheme }: HeaderProps) {
  const [auth, setAuth] = React.useState(false);
  const [anchorElLang, setAnchorElLang] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const { i18n } = useTranslation();

 

 
  // User menu handlers
  const handleUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };


  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

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

  return  (
    <>
      <StyledAppBar>
        <Toolbar>
        <Grid container alignItems="center" >
          {/* Izquierda: Menú Icono */}
          <Grid item xs={3} display="flex" justifyContent="flex-start">
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
          </Grid>

          {/* Centro: LogoBox */}
          <Grid item xs={6} display="flex" justifyContent="center">
            <LogoBox title="BidMon Universe" />
          </Grid>

          {/* Derecha: UserMenu */}
          <Grid item xs={3} display="flex" justifyContent="flex-end">
          <UserMenu
            auth={auth}
            anchorElUser={anchorElUser}
            handleUserMenu={handleUserMenu}
            handleCloseUserMenu={handleCloseUserMenu}
          />
          </Grid>
        </Grid>
         
          
        </Toolbar>
      </StyledAppBar>
      {/* Contenedor para ThemeSwitch y LanguageMenu debajo del AppBar */}
      <ControlsContainer>
        <LanguageMenu
          anchorElLang={anchorElLang}
          handleLanguageMenu={handleLanguageMenu}
          handleCloseLanguageMenu={handleCloseLanguageMenu}
        />
        <ThemeSwitch toggleTheme={toggleTheme} />
      </ControlsContainer>
    </>
  );
}

//#endregion