import { Button, IconButton, Menu, MenuItem } from '@mui/material';

import TranslateIcon from '@mui/icons-material/Translate';

//#region PROPS
interface LanguageMenuProps {
  anchorElLang: null | HTMLElement;
  handleLanguageMenu: (event: React.MouseEvent<HTMLElement>) => void;
  handleCloseLanguageMenu: (languageKey: string) => void;
  texto?: string;
  tabIndex?: number;
}
//#endregion

//#region COMPONENTE LANGUAGE MENU
export default function LanguageMenu({ anchorElLang, handleLanguageMenu, handleCloseLanguageMenu, texto, tabIndex = 0 }: LanguageMenuProps) {
  return (
    <>
      {texto ? (
        <Button
          color="inherit"
          onClick={handleLanguageMenu}
          startIcon={<TranslateIcon />}
          aria-label="Cambiar idioma"
          tabIndex={tabIndex}
        >
          Cambiar idioma
        </Button>
      ) : (
        <IconButton
          color="inherit"
          aria-label="Cambiar idioma"
          onClick={handleLanguageMenu}
          tabIndex={tabIndex}
        >
          <TranslateIcon />
        </IconButton>
      )}

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
        onClose={() => handleCloseLanguageMenu('')}
      >
        <MenuItem
          onClick={() => handleCloseLanguageMenu('es')}
          aria-label="Cambiar a español"
          tabIndex={tabIndex + 1}
        >
          <img
            width="30"
            height="30"
            src="https://img.icons8.com/fluency/48/spain-circular.png"
            alt="Bandera de España"
          />
          ES
        </MenuItem>
        <MenuItem
          onClick={() => handleCloseLanguageMenu('en')}
          aria-label="Cambiar a inglés"
          tabIndex={tabIndex + 2}
        >
          <img
            width="30"
            height="30"
            src="https://img.icons8.com/color/96/000000/great-britain-circular.png"
            alt="Bandera de Gran Bretaña"
          />
          EN
        </MenuItem>
      </Menu>
    </>
  );
}
//#endregion