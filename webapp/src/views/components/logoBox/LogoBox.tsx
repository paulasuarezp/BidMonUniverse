import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

//#region PROPS
interface LogoBoxProps {
  size?: number;
  title?: string;
}
//#endregion

//#region STYLES
const StyledTypography = styled(Typography)(({ theme }) => ({
    fontFamily: 'Pokemon',
    color: theme.palette.primary.contrastText,
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.25rem', // Ajusta este valor según tus necesidades para dispositivos móviles
    },
}));
//#endregion

//#region COMPONENTE LOGOBOX
export default function LogoBox ({ size = 60, title = "BidMon Universe" }: LogoBoxProps) {
  const navigate = useNavigate();

  const handleHomeClick = () => {
      navigate('/');
  };

  return (
        <Box display="flex" alignItems="center" onClick={handleHomeClick} style={{ cursor: 'pointer', margin:'10px' }}>
            <img
              src="/logo-sf.png"
              alt={`Logo de ${title}`}
              style={{ width: '100%', height: 'auto', maxWidth: size }}
            />
            {title && (
              <StyledTypography variant="h4" sx={{ flexGrow: 1, marginLeft: 1 }}>
                {title}
              </StyledTypography>
            )}
        </Box>
      );
};
//#endregion
