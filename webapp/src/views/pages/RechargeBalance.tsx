import { Box, TextField } from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Container from '../components/container/Container';
import Paper from '../components/paper/Paper';

//#region COMPONENT Login
export default function RechargeBalance() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [balance, setBalance] = useState(1);
    const [errorMessage, setErrorMessage] = useState(''); // Estado para almacenar el mensaje de error

    const handlePay = async () => {
        console.log('Recargando saldo...');
        // Lógica para recargar el saldo
    };

    const handleBalanceChange = (value: string) => {

        if (value === '' || parseInt(value) < 1) {
            setErrorMessage('Por favor, introduce una cantidad válida para pujar. Mínimo: 1 zen');
        } else {
            setErrorMessage('');
            setBalance(parseInt(value));
        }
    };

    return (
        <Container>
            <Paper
                title="Recargar saldo"
                imageSrc="logo-sf.png"
                elevation={3}
                sx={{
                    maxWidth: 400,
                    margin: 'auto',
                    mt: { xs: 0, sm: 10 },
                    mb: { xs: 0, sm: 0 },
                    pt: 2,
                }}
            >
                <Box sx={{ pl: 2, pr: 2, pb: 2 }}>
                    <TextField
                        margin="dense"
                        id="cantidad"
                        label="Cantidad a recargar"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={balance}
                        onChange={e => handleBalanceChange(e.target.value)}
                        error={errorMessage !== ''}
                        helperText={errorMessage ? 'Por favor, introduce una cantidad válida para pujar. Mínimo: 1 zen' : 'Valor predeterminado: 1 zen.'}
                    />
                </Box>
            </Paper>
        </Container>
    );
};
//#endregion
