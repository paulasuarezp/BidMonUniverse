import React, { useState } from 'react';
import {
    Button, TextField, Dialog, DialogContent, DialogActions, Typography, Grow, GrowProps, Snackbar, Backdrop, CircularProgress, Alert, useTheme, Box, IconButton
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';

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
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

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
        setConfirmDialogOpen(false);
        setLoading(true);

        // Simulación de una operación asincrónica
        setTimeout(() => {
            setLoading(false);
            setSnackbarMessage('Tu subasta ha sido creada.');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        }, 2000);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
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
                <DialogContent>
                    <WarningIcon style={{ fontSize: 40, color: theme.palette.warning.main }} />
                    <Typography variant="h6" gutterBottom>
                        Confirmar Subasta
                    </Typography>
                    <Typography>ID de la Carta: {cardId}</Typography>
                    <Typography>Precio Base: {basePrice}</Typography>
                    <Typography>Duración: {duration} horas</Typography>
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center' }}>
                    <Button onClick={() => setConfirmDialogOpen(false)} variant="contained" color='error'>
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmAuction} variant="contained" color="success">
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Estado de Carga */}
            <Backdrop style={{ zIndex: 1300 }} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>

            {/* Notificación de Éxito/Error */}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default AddAuctionForm;
