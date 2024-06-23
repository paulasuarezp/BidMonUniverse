import { Box, TextField } from '@mui/material';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { handlePay } from '../../api/paypalAPI';
import { RootState } from '../../redux/store';
import Container from '../components/container/Container';
import Paper from '../components/paper/Paper';

export default function RechargeBalance() {
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const sessionUser = useSelector((state: RootState) => state.user);

    const [balance, setBalance] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');
    const [total, setTotal] = useState(1); // Asumimos que 1 balance cuesta 1 EUR
    const username = sessionUser.username.toLowerCase();


    const handleBalanceChange = (value: string) => {
        if (value === '' || parseInt(value) < 1) {
            setErrorMessage('Por favor, introduce una cantidad válida para recargar. Mínimo: 1 zen');
        } else {
            setErrorMessage('');
            const balanceValue = parseInt(value);
            setBalance(balanceValue);
            setTotal(balanceValue); // Ajustar la lógica de cálculo de total si es necesario
        }
    };

    const handleApprove = async (orderID: string) => {
        await handlePay(orderID, total, username, total * 10);
    };

    return (
        <Container>
            <Paper
                title="Recargar Saldo"
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
                        id="basePrice"
                        label="Precio Base"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={balance}
                        onChange={e => handleBalanceChange(e.target.value)}
                        error={errorMessage !== ''}
                        helperText={errorMessage ? 'Por favor, introduce una cantidad válida para recarar. Mínimo: 1 zen' : 'Valor predeterminado: 1 zen.'}
                    />
                    <PayPalScriptProvider options={{ clientId: "AXE7-9Er_F_oY9-RdBsCvSZQ1OBfeTbgUVzzTj1tZk9RivJRYoI5U-xNYqUgqwY0z3_M4NvC6hJ5Cg8_", currency: "EUR" }}>
                        <PayPalButtons
                            createOrder={(data, actions) => {
                                return actions.order.create({
                                    intent: "CAPTURE", // Añadir propiedad intent
                                    purchase_units: [{
                                        amount: {
                                            currency_code: 'EUR',
                                            value: total.toString(), // Valor dinámico del saldo
                                        },
                                    }],
                                });
                            }}
                            onApprove={(data, actions) => {
                                return actions.order.capture().then(details => {
                                    handleApprove(data.orderID);
                                });
                            }}
                            onError={(err) => {
                                console.error(err);
                            }}
                        />
                    </PayPalScriptProvider>
                </Box>
            </Paper>
        </Container>
    );
}
