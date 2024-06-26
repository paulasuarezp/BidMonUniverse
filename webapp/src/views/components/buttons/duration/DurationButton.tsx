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
    '&:hover, &:active, &:focus': {
        boxShadow: theme.palette.mode === 'light' ?
            '2px 2px 2px 0px rgba(255, 255, 255, 0.25), 0px 0px 2px 0px rgba(255, 255, 255, 0.25)' :
            '2px 2px 2px 0px rgba(72, 187, 120, 0.35), 0px 0px 2px 0px rgba(72, 187, 120, 0.35)',
        textShadow: theme.palette.mode === 'light' ?
            '0 0 10px rgba(255, 255, 255, 0.6), 0 0 20px rgba(255, 255, 255, 0.4)' :
            '0 0 10px rgba(72, 187, 120, 0.6), 0 0 20px rgba(72, 187, 120, 0.4)',
        borderBottom: '2px solid #48BB78',
        borderRight: '2px solid #48BB78',
        backgroundColor: 'rgba(72, 187, 120, 0.4)',  // Verde claro
    },
    '&:active, &:focus': {
        outline: 'none',
        border: 'none',
    },
}));
// #endregion

// #region COMPONENT DurationButton
export default function DurationButton({ duration, ...rest }: DurationButtonProps) {
    return (
        <StyledIconButton {...rest}>
            <Stack direction="row" alignItems="center" spacing={1}>
                <Typography>{duration} horas</Typography>
                <TimerIcon />
            </Stack>
        </StyledIconButton>
    );
};
// #endregion