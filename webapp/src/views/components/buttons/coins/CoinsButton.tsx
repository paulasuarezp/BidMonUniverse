import { Stack, IconButton, Typography, IconButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

interface CoinsButtonProps extends IconButtonProps {
    balance: number;
}

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    fontWeight: 'bold',
    letterSpacing: '0.1em',
    backgroundColor: 'rgba(248, 226, 96, 0.2)',
    border: 'none',
    borderBottom: '2px solid #F8E260',
    borderRight: '2px solid #F8E260',
    textTransform: 'none',
    borderRadius: '20px',
    color: '#FFFFFF',
    marginRight: '10px',
    '&:hover, &:active, &:focus': {
        boxShadow: theme.palette.mode === 'light' ?
            '2px 2px 2px 0px rgba(255, 255, 255, 0.25), 0px 0px 2px 0px rgba(255, 255, 255, 0.25)' :
            '2px 2px 2px 0px rgba(229, 62, 48, 0.35), 0px 0px 2px 0px rgba(229, 62, 48, 0.35)',
        textShadow: theme.palette.mode === 'light' ?
            '0 0 10px rgba(255, 255, 255, 0.6), 0 0 20px rgba(255, 255, 255, 0.4)' :
            '0 0 10px rgba(229, 62, 48, 0.6), 0 0 20px rgba(229, 62, 48, 0.4)',
        borderBottom: '2px solid #F8E260',
        borderRight: '2px solid #F8E260',
        backgroundColor: 'rgba(248, 226, 96, 0.4)',
    },
    '&:active, &:focus': {
        outline: 'none',
        border: 'none',
    },
}));

export default function CoinsButton({ balance, ...rest }: CoinsButtonProps) {
    return (
        <StyledIconButton {...rest}>
            <Stack direction="row" alignItems="center" spacing={1}>
                <Typography>{balance}</Typography>
                <img src="/zen.png" alt="Saldo del usuario en zens" style={{ width: '1.2em', height: 'auto' }} />
            </Stack>
        </StyledIconButton>
    );
};
