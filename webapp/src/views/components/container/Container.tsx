import { Container as MuiContainer, ContainerProps} from '@mui/material';
import { styled } from '@mui/material/styles';

//#region STYLES
const StyledContainer = styled(MuiContainer)<ContainerProps>(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    padding: '0 !important',
    flexDirection: 'column',
    minHeight: '100vh',
    minWidth: '100vw',
    alignContent: 'center',
}));
//#endregion

//#region COMPONENTE CONTAINER
export default function Container({ children }:ContainerProps) {
    return (
        <StyledContainer>
            {children}
        </StyledContainer>
    );
}
//#endregion