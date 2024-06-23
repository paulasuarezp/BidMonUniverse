import { Box, TextField } from '@mui/material';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../redux/store';
import Container from '../components/container/Container';
import Paper from '../components/paper/Paper';

export default function RechargeBalance() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const sessionUser = useSelector((state: RootState) => state.user);
    const [balance, setBalance] = useState(1); // 1 EUR = 10 zens
    const [errorMessage, setErrorMessage] = useState('');
    const [total, setTotal] = useState(1);
    const [message, setMessage] = useState("");
    const username = sessionUser.username.toLowerCase();

    const handleTotalChange = (value: string) => {
        if (value === '' || parseInt(value) < 1) {
            setErrorMessage('Por favor, introduce una cantidad válida para recargar. Mínimo: 1 zen');
        } else {
            setErrorMessage('');
            const totalValue = parseInt(value);
            setBalance(totalValue * 10);
            setTotal(totalValue);
        }
    };

    const apiEndPointBase = 'http://localhost:5001/paypal'; // Base URL for the PayPal API endpoints


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
                        value={total}
                        onChange={e => handleTotalChange(e.target.value)}
                        error={errorMessage !== ''}
                        helperText={errorMessage ? 'Por favor, introduce una cantidad válida para recargar. Mínimo: 1 zen' : 'Valor predeterminado: 1 zen.'}
                    />
                    <PayPalScriptProvider options={{ "clientId": "AXE7-9Er_F_oY9-RdBsCvSZQ1OBfeTbgUVzzTj1tZk9RivJRYoI5U-xNYqUgqwY0z3_M4NvC6hJ5Cg8_", currency: "EUR" }}>
                        <PayPalButtons
                            style={{
                                shape: "rect",
                                layout: "vertical",
                                color: "gold",
                                label: "pay",
                            }}
                            createOrder={async () => {
                                try {
                                    const response = await fetch(`${apiEndPointBase}/orders`, {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            username: username,
                                            balance: balance,
                                            total: total,
                                        }),
                                    });

                                    const orderData = await response.json();

                                    if (orderData.id) {
                                        return orderData.id;
                                    } else {
                                        const errorDetail = orderData?.details?.[0];
                                        const errorMessage = errorDetail
                                            ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                                            : JSON.stringify(orderData);

                                        throw new Error(errorMessage);
                                    }
                                } catch (error) {
                                    console.error(error);
                                    setMessage(`No se pudo iniciar PayPal Checkout...${error}`);
                                }
                            }}
                            onApprove={async (data, actions) => {
                                try {
                                    const orderData = await actions.order.capture();
                                    console.log('Capture result', orderData);

                                    if (!orderData.purchase_units || !orderData.purchase_units[0].payments || !orderData.purchase_units[0].payments.captures) {
                                        console.error('Response structure unexpected:', orderData);
                                        throw new Error('Response structure unexpected. Check the response format.');
                                    }

                                    const transaction = orderData.purchase_units[0].payments.captures[0];
                                    setMessage(`Transaction ${transaction.status}: ${transaction.id}. See console for all available details`);

                                    // Enviar solicitud al servidor para actualizar el saldo del usuario
                                    const response = await fetch(`http://localhost:5001/paypal/updateorder`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            username: username, // Asegúrate de usar el nombre de usuario correcto aquí
                                            balance: balance// La cantidad que deseas agregar al balance del usuario
                                        }),
                                    });

                                    const result = await response.json();
                                    console.log('Server response:', result);

                                    if (response.ok) {
                                        setMessage(`Pago completado con éxito y saldo actualizado. ${result.message}`);
                                    } else {
                                        setMessage(`Error al actualizar el saldo: ${result.error}`);
                                    }
                                } catch (error) {
                                    console.error('Error in onApprove:', error);
                                    setMessage(`Lo siento, su transacción no pudo ser procesada...${error.message}`);
                                }
                            }}
                            onError={(err) => {
                                console.error('Error al crear la orden:', err);
                                setMessage(`Error al crear la orden: ${err}`);
                            }}
                        />
                    </PayPalScriptProvider>
                    {message && <p>{message}</p>}
                </Box>
            </Paper>
        </Container>
    );
}
