import { IconButton, Button, MenuItem, Menu } from '@mui/material';

import TranslateIcon from '@mui/icons-material/Translate';

//#region PROPS
interface LanguageMenuProps {
    anchorElLang: null | HTMLElement;
    handleLanguageMenu: (event: React.MouseEvent<HTMLElement>) => void;
    handleCloseLanguageMenu: (languageKey: string) => void;
    texto?: string;
  }
//#endregion

//#region COMPONENTE LANGUAGE MENU
export default function LanguageMenu({ anchorElLang, handleLanguageMenu, handleCloseLanguageMenu, texto }: LanguageMenuProps) {
    return (
        <>
        {
          texto ? 
          ( <Button color="inherit" onClick={handleLanguageMenu} startIcon={<TranslateIcon />}> Cambiar idioma </Button>)
          :
          ( <IconButton color="inherit" aria-label="change language" onClick={handleLanguageMenu}>
              <TranslateIcon />
            </IconButton>)
        }
       
        
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
            <MenuItem onClick={() => handleCloseLanguageMenu('es')}>
            <img width="30" height="30" src="https://img.icons8.com/fluency/48/spain-circular.png" alt="spain-circular"/>
            ES
            </MenuItem>
            <MenuItem onClick={() => handleCloseLanguageMenu('en')}>
            <img width="30" height="30" src="https://img.icons8.com/color/96/000000/great-britain-circular.png" alt="great-britain-circular"/>
            EN
            </MenuItem>
        </Menu>
      </>
    );
  }
//#endregion