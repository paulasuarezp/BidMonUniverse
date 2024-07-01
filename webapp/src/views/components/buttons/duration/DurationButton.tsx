import TimerIcon from '@mui/icons-material/Timer';
import { IconButton, IconButtonProps, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

// #region PROPS
interface DurationButtonProps extends IconButtonProps {
    duration: number;
}
// #endregion

// #region STYLES
const StyledIconButton = styled(IconButton)(({ theme }) => ({
    fontWeight: 'bold',
    letterSpacing: '0.1em',
    backgroundColor: 'rgba(72, 187, 120, 0.2)',  // Verde claro
    border: 'none',
    borderBottom: '2px solid #48BB78',  // Verde más oscuro
    borderRight: '2px solid #48BB78',  // Verde más oscuro
    textTransform: 'none',
    borderRadius: '20px',
    color: theme.palette.mode === 'light' ? '#000000' : '#FFFFFF',  // Verde más oscuro
    marginRight: '10px',
    '&:disabled': {
        backgroundColor: 'rgba(72, 187, 120, 0.2)',  // Verde claro
        border: 'none',
        borderBottom: '2px solid #48BB78',  // Verde más oscuro
        borderRight: '2px solid #48BB78',  // Verde más oscuro
        textTransform: 'none',
        borderRadius: '20px',
        marginRight: '10px',
        color: theme.palette.mode === 'light' ? '#000000' : '#FFFFFF',  // Verde más oscuro
    },
    '&:focus-visible': {
        outline: '2px solid #48BB78', // Mejora de accesibilidad 
    },
}));
// #endregion

// #region COMPONENT DurationButton
export default function DurationButton({ duration, ...rest }: DurationButtonProps) {
    return (
        <StyledIconButton {...rest} role='status' aria-live="polite" aria-label={`Duración: ${duration} horas`} disabled>
            <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant='body1'>{duration} horas</Typography>
                <TimerIcon />
            </Stack>
        </StyledIconButton>
    );
};
// #endregion