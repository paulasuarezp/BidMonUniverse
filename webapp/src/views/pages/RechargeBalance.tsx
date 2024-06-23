import { Box, InputAdornment, TextField, Typography } from '@mui/material';
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
    const [balance, setBalance] = useState(10); // 1 EUR = 10 zens
    const [errorMessage, setErrorMessage] = useState('');
    const [total, setTotal] = useState(1);
    const [message, setMessage] = useState("");
    const username = sessionUser.username.toLowerCase();


    const handleBalanceChange = (value: string) => {
        if (value === '' || parseInt(value) < 10 || parseInt(value) % 10 !== 0) {
            setErrorMessage('Por favor, introduce una cantidad válida en múltiplos de 10.');
        } else {
            setErrorMessage('');
            const balanceValue = parseInt(value);
            setTotal(balanceValue / 10);
            setBalance(balanceValue);
        }
    };

    const handleInputBlur = (event) => {
        const newValue = parseInt(event.target.value);
        if (!isNaN(newValue)) {
            const roundedValue = Math.round(newValue / 10) * 10;
            handleBalanceChange(roundedValue.toString());
        }
    };

    const handleInputChange = (event) => {
        const newValue = parseInt(event.target.value);
        if (newValue % 10 === 0) {
            handleBalanceChange(event.target.value);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            event.preventDefault();
            const increment = event.key === "ArrowUp" ? 10 : -10;
            const newValue = balance + increment;
            if (newValue >= 10) {
                handleBalanceChange(newValue.toString());
            }
        }
    };

    const apiEndPointBase = 'http://localhost:5001/paypal'; // Base URL for the PayPal API endpoints

    return (
        <Container>
            <Paper
                title="Recargar saldo"
                imageSrc="recharge-meowth.png"
                elevation={3}
                sx={{
                    maxWidth: 400,
                    margin: 'auto',
                    mt: { xs: 0, sm: 5 },
                    mb: { xs: 0, sm: 0 },
                    pt: 2,
                }}
            >
                <Box sx={{ pl: 2, pr: 2, pb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom align="center">
                        ¡Elige la cantidad de saldo que deseas recargar!
                    </Typography>
                    <Box display="flex" alignItems="center" justifyContent="center" mt={1} mb={2}>
                        <Typography variant="body2" align="center">
                            La conversión es de 1€ = 10 Zens
                        </Typography>
                        <img src="/zen.png" alt="Saldo del usuario en zens" style={{ width: '1.2em', marginLeft: 10, height: 'auto' }} />
                    </Box>

                    <TextField
                        margin="dense"
                        id="basePrice"
                        label="Total en Zens"
                        type="number"
                        fullWidth
                        variant="outlined"
                        onBlur={handleInputBlur}
                        value={balance}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        error={errorMessage !== ''}
                        helperText={errorMessage ? 'Por favor, introduce una cantidad válida en múltiplos de 10.' : 'Valor predeterminado: 10 Zens.'}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <img src={`/zen.png`} alt="zen icon" style={{ width: 24, height: 24 }} />
                                </InputAdornment>
                            ),
                            inputProps: { step: 10 },
                        }}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        margin="dense"
                        id="precio"
                        label="Total a pagar"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={total}
                        disabled
                        sx={{ mb: 2 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    €
                                </InputAdornment>
                            )
                        }}
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
