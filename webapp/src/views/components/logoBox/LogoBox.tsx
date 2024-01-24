import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';


//#region PROPS
interface LogoBoxProps {
  size?: number;
  title?: string;
}
//#endregion

//#region STYLES
// otra tipografía: "Nabla",
const StyledTypography = styled(Typography)(({ theme }) => ({
    fontFamily:  'Pokemon', 
  }));

//#endregion

//#region COMPONENTE LOGOBOX
export default function LogoBox ({ size = 60, title = "BidMon Universe" }: LogoBoxProps) {
  return (
        <Box display="flex" alignItems="center">
          <img
            src="/logo-sf.png"
            alt={`Logo de ${title}`}
            style={{ width: '100%', height: 'auto', maxWidth: size }}
          />
          {title && (
            <StyledTypography variant="h4" sx={{ flexGrow: 1, marginLeft: 1, marginBottom: 2 }}>
              {title}
            </StyledTypography>
          )}
        </Box>
      );
    };
//#endregion