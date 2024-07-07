import { Box, Typography, useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

//#region PROPS
interface LogoBoxProps {
  size?: number;
  title?: string;
  tabIndex?: number;
}
//#endregion

//#region STYLES
const StyledTypography = styled(Typography)(({ theme }) => ({
  fontFamily: 'Pokemon',
  color: theme.palette.primary.contrastText,
  fontSize: '2.5rem',
}));
//#endregion

//#region COMPONENTE LOGOBOX
// Componente que muestra el logo de la aplicación y el título
export default function LogoBox({ size = 60, title = "BidMon Universe", tabIndex }: LogoBoxProps) {
  const navigate = useNavigate();

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      onClick={handleHomeClick}
      sx={{
        cursor: 'pointer',
        margin: '10px',
        '&:focus': {
          outline: '2px solid #007BFF',
          outlineOffset: '4px',
        },
      }}
      role="button"
      aria-label={`Ir a la página principal de ${title}`}
      tabIndex={tabIndex ? tabIndex : 0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleHomeClick();
        }
      }}
    >
      <img
        src="/logo-sf.png"
        alt={`Logo de ${title}`}
        style={{ width: '100%', height: 'auto', maxWidth: size }}
      />
      {(!isMobile && title) && (
        <StyledTypography sx={{ flexGrow: 1, marginLeft: 1 }} variant="h1">
          {title}
        </StyledTypography>
      )}
    </Box>
  );
};
//#endregion
