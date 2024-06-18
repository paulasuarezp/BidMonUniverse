import React, { useState } from 'react';
import {
    Button, TextField, Dialog, DialogContent, DialogActions, Typography, Grow, GrowProps, CircularProgress, useTheme, Box, Fade
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { makeStyles } from '@mui/material/styles';

const Transition = React.forwardRef(function Transition(
    props: GrowProps & { children: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
) {
    return <Grow {...props} ref={ref} />;
});

interface AuctionModalProps {
    open: boolean;
    handleClose: () => void;
    cardId: string;
}

function AddAuctionForm({ open, handleClose, cardId }: AuctionModalProps) {
    const [basePrice, setBasePrice] = useState('0');
    const [duration, setDuration] = useState('72');
    const [basePriceError, setBasePriceError] = useState(false);
    const [durationError, setDurationError] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [closing, setClosing] = useState(false); // Estado adicional para el cierre suave
    const theme = useTheme();

    const handleCreateAuction = () => {
        let valid = true;

        if (isNaN(Number(basePrice)) || Number(basePrice) < 0) {
            setBasePriceError(true);
            valid = false;
        } else {
            setBasePriceError(false);
        }

        if (isNaN(Number(duration)) || Number(duration) <= 0) {
            setDurationError(true);
            valid = false;
        } else {
            setDurationError(false);
        }

        if (!valid) {
            return;
        }

        setConfirmDialogOpen(true);
    };

    const handleConfirmAuction = () => {
        setLoading(true);

        // Simulación de una operación asincrónica
        new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 2000);
        }).then(() => {
            setLoading(false);
            setSuccess(true);

            setTimeout(() => {
                setSuccess(false);
                setClosing(true); // Inicia el cierre suave

                setTimeout(() => {
                    setClosing(false); // Resetea el estado de cierre suave
                    setConfirmDialogOpen(false);
                    handleClose();
                }, 500); // Tiempo para la transición de cierre suave
            }, 2000); // Mostrar el mensaje de éxito durante 2 segundos antes de cerrar el diálogo
        });
    };

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
                TransitionComponent={Transition}
                PaperProps={{
                    style: {
                        borderRadius: 15,
                        padding: '20px',
                        maxWidth: '500px',
                        textAlign: 'center'
                    }
                }}
            >
                <DialogContent>
                    <Typography variant="h6" gutterBottom>
                        Crear Subasta para la Carta {cardId}
                    </Typography>
                    <TextField
                        margin="dense"
                        id="cardId"
                        label="ID de la Carta"
                        type="text"
                        fullWidth
                        variant="outlined"
                        sx={{ backgroundColor: '#f0f0f0' }}
                        value={cardId}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <TextField
                        margin="dense"
                        id="basePrice"
                        label="Precio Base"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={basePrice}
                        onChange={e => setBasePrice(e.target.value)}
                        error={basePriceError}
                        helperText={basePriceError ? 'Por favor, introduce un precio base válido' : 'Valor predeterminado: 0'}
                    />
                    <TextField
                        margin="dense"
                        id="duration"
                        label="Duración (horas)"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={duration}
                        onChange={e => setDuration(e.target.value)}
                        error={durationError}
                        helperText={durationError ? 'Por favor, introduce una duración válida' : 'Valor predeterminado: 72 horas'}
                    />
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center' }}>
                    <Button onClick={handleClose} variant="outlined" color="error">
                        Cancelar
                    </Button>
                    <Button onClick={handleCreateAuction} variant="contained" color="success">
                        Crear Subasta
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Confirmación de la Subasta */}
            <Dialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                aria-labelledby="confirm-dialog-title"
                TransitionComponent={Transition}
                PaperProps={{
                    style: {
                        borderRadius: 15,
                        padding: '20px',
                        maxWidth: '500px',
                        textAlign: 'center'
                    }
                }}
            >
                <Fade in={!loading && !success && !closing} timeout={{ enter: 500, exit: 500 }}>
                    <DialogContent>
                        <Box>
                            <WarningIcon style={{ fontSize: 50, color: theme.palette.warning.main }} />
                            <Typography variant="h4" gutterBottom>
                                Confirmar Subasta
                            </Typography>
                            <Typography variant="body2">ID de la Carta: {cardId}</Typography>
                            <Typography variant="body2">Precio Base: {basePrice}</Typography>
                            <Typography variant="body2">Duración: {duration} horas</Typography>
                        </Box>
                    </DialogContent>
                </Fade>

                <Fade in={loading} timeout={{ enter: 500, exit: 500 }}>
                    <DialogContent>
                        <CircularProgress />
                    </DialogContent>
                </Fade>

                <Fade in={success} timeout={{ enter: 500, exit: 500 }}>
                    <DialogContent>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <CheckCircleIcon style={{ fontSize: 50, color: theme.palette.success.main }} />
                            <Typography variant="h6" gutterBottom>
                                ¡Subasta Creada!
                            </Typography>
                        </Box>
                    </DialogContent>
                </Fade>

                {!loading && !success && (
                    <DialogActions style={{ justifyContent: 'center' }}>
                        <Button onClick={() => setConfirmDialogOpen(false)} variant="contained" color='error'>
                            Cancelar
                        </Button>
                        <Button onClick={handleConfirmAuction} variant="contained" color="success">
                            Confirmar
                        </Button>
                    </DialogActions>
                )}
            </Dialog>
        </div>
    );
}

export default AddAuctionForm;
