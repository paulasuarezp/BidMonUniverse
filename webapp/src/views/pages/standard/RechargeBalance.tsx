import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Alert, Box, InputAdornment, TextField, Typography } from '@mui/material';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateBalance } from '../../../redux/slices/userSlice';
import { RootState } from '../../../redux/store';
import Button from '../../components/buttons/Button';
import Container from '../../components/container/Container';
import BaseForm from '../../components/forms/BaseForm'; // Asegúrate de ajustar la ruta según sea necesario
import PokeballsBox from '../../components/ornament/PokeballsBox';
import Paper from '../../components/paper/Paper';

//#region COMPONENTE RECHARGBALANCE
export default function RechargeBalance() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const sessionUser = useSelector((state: RootState) => state.user);
    const [balance, setBalance] = useState(10); // 1 EUR = 10 zens
    const [errorMessage, setErrorMessage] = useState('');
    const [total, setTotal] = useState(1);
    const [message, setMessage] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState({ loading: false, error: '', successMessage: '' });
    const username = sessionUser.username.toLowerCase();

    const totalRef = useRef(total);
    totalRef.current = total;
    const balanceRef = useRef(balance);
    balanceRef.current = balance;

    useEffect(() => {
    }, [total]);

    /**
     * Función para manejar el cambio en el saldo.
     * Actualiza el saldo y el total a pagar si el valor es válido.
     * @param value 
     */
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

    /**
     * Función para manejar el evento de perder el foco del campo de texto
     * @param event 
     */
    const handleInputBlur = (event) => {
        const newValue = parseInt(event.target.value);
        if (!isNaN(newValue)) {
            const roundedValue = Math.round(newValue / 10) * 10;
            handleBalanceChange(roundedValue.toString());
        }
    };

    /**
     * Función para manejar el cambio en el campo de texto.
     * Si el nuevo valor es múltiplo de 10, llama a la función handleBalanceChange.
     * @param {Event} event - El evento de cambio del campo de texto.
    */
    const handleInputChange = (event) => {
        const newValue = parseInt(event.target.value);
        if (newValue % 10 === 0) {
            handleBalanceChange(event.target.value);
        }
    };


    /**
     * Función para manejar el evento de pulsar una tecla, 
     * permitiendo incrementar o decrementar el saldo con las flechas arriba y abajo respectivamente.
     * Incrementa o decrementa el saldo en 10 unidades.
     * @param event 
     */
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

    /**
     * Función para manejar el cierre del diálogo
     */
    const handleDialogClose = () => {
        setDialogOpen(false);
        setDialogContent({ loading: false, error: '', successMessage: '' });
    };

    /**
     * Redirige al usuario a la página de inicio
     */
    const handleBack = () => {
        navigate('/');
    };



    const apiEndPointBase = 'http://localhost:5001/paypal'; // Base URL for the PayPal API endpoints

    return (
        <Container>
            <Button startIcon={<ArrowBackIcon />}
                variant="contained"
                sx={{ alignSelf: 'flex-start', margin: '10px' }}
                buttonType="ghost"
                onClick={handleBack}
                label="Volver a la página de inicio"
            />
            <PokeballsBox titulo='Recarga de Saldo' />
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
                        <Alert severity="info" >
                            La conversión es de 1€ = 10 Zens
                            <img src="/zen.png" alt="Saldo del usuario en zens" style={{ width: '1.2em', marginLeft: 10, height: 'auto' }} />

                        </Alert>
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
                            createOrder={async (data, actions) => {
                                try {
                                    const response = await fetch(`${apiEndPointBase}/orders`, {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            username: username,
                                            balance: balanceRef.current,
                                            total: totalRef.current,
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
                                    setDialogContent({ loading: false, error: `No se pudo iniciar PayPal Checkout...${error}`, successMessage: '' });
                                    setDialogOpen(true);
                                }
                            }}
                            onApprove={async (data, actions) => {
                                try {
                                    const orderData = await actions.order.capture();

                                    if (!orderData.purchase_units || !orderData.purchase_units[0].payments || !orderData.purchase_units[0].payments.captures) {
                                        console.error('Response structure unexpected:', orderData);
                                        throw new Error('Response structure unexpected. Check the response format.');
                                    }

                                    const transaction = orderData.purchase_units[0].payments.captures[0];
                                    setDialogContent({ loading: false, error: '', successMessage: `Transaction ${transaction.status}: ${transaction.id}. See console for all available details` });
                                    setDialogOpen(true);

                                    // Enviar solicitud al servidor para actualizar el saldo del usuario
                                    const response = await fetch(`http://localhost:5001/paypal/updateorder`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            username: username, // Asegúrate de usar el nombre de usuario correcto aquí
                                            balance: balanceRef.current, // La cantidad que deseas agregar al balance del usuario
                                        }),
                                    });

                                    const result = await response.json();

                                    if (response.ok) {
                                        setDialogContent({ loading: false, error: '', successMessage: `Pago completado con éxito y saldo actualizado.` });
                                        setBalance(10);
                                        setTotal(1);
                                        dispatch(updateBalance(result.user.balance));
                                    } else {
                                        setDialogContent({ loading: false, error: `Error al actualizar el saldo: ${result.error}`, successMessage: '' });
                                    }
                                    setDialogOpen(true);
                                } catch (error) {
                                    setDialogContent({ loading: false, error: `Lo siento, su transacción no pudo ser procesada...${error.message}`, successMessage: '' });
                                    setDialogOpen(true);
                                }
                            }}
                            onError={(err) => {
                                setDialogContent({ loading: false, error: `Error al crear la orden: ${err}`, successMessage: '' });
                                setDialogOpen(true);
                            }}
                        />
                    </PayPalScriptProvider>
                    {message && <p>{message}</p>}
                </Box>
            </Paper>
            <BaseForm
                open={dialogOpen}
                onClose={handleDialogClose}
                title="Recarga de Saldo"
                content={<></>}
                loading={dialogContent.loading}
                error={dialogContent.error}
                successMessage={dialogContent.successMessage}
                actions={[
                    { label: 'Aceptar', onClick: handleDialogClose, buttonType: 'primary' }
                ]}
                showIcon={dialogContent.error ? 'error' : 'success'}
            />
        </Container>
    );
}
