import { Container as MuiContainer, ContainerProps} from '@mui/material';
import { styled } from '@mui/system';

//#region STYLES
const StyledContainer = styled(MuiContainer)<ContainerProps>(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    minWidth: '100vw',
    alignContent: 'center',
}));
//#endregion

//#region COMPONENTE CONTAINER
export default function Container({ children, ...other }:ContainerProps) {
    return (
        <StyledContainer>
            {children}
        </StyledContainer>
    );
}
//#endregion