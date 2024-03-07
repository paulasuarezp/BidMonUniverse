import React, { useEffect } from 'react';
import { AppBar, Toolbar, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
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

const StyledAppBar = styled(AppBar)(({ theme }) => ({
 
  backgroundColor: theme.palette.mode === 'light' ? 
                   '#c92918' : // Color para modo claro BA4940
                   theme.palette.background.default, // Color para modo oscuro o cualquier otro modo
                   boxShadow: theme.palette.mode === 'light' ? 
                   'default': // Sombra para modo claro
                   '0px 2px 6px rgba(255, 255, 255, 0.24)', 
  borderRadius: '6em',
}));

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

  return (
    
    <StyledAppBar position="static" >
      <Toolbar style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{mr:2}}>
            <MenuIcon />
          </IconButton>
          <LogoBox title="BidMon Universe"/>
        </div>
       
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <LanguageMenu
            anchorElLang={anchorElLang}
            handleLanguageMenu={handleLanguageMenu}
            handleCloseLanguageMenu={handleCloseLanguageMenu}
          />
          <ThemeSwitch toggleTheme={toggleTheme}  />
          <UserMenu
            auth={auth}
            anchorElUser={anchorElUser}
            handleUserMenu={handleUserMenu}
            handleCloseUserMenu={handleCloseUserMenu}
          />
        </div>
      </Toolbar>
    </StyledAppBar>
  );
}

//#endregion