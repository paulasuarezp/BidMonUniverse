import React, { useState } from 'react';
import {
    TextField, Dialog, DialogContent, DialogActions, Typography, Grow, GrowProps, CircularProgress, useTheme, Box, Divider
} from '@mui/material';
import Button from '../buttons/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { addAuction } from '../../../api/auctionsAPI';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { ErrorTwoTone } from '@mui/icons-material';



const Transition = React.forwardRef(function Transition(
    props: GrowProps & { children: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
) {
    return <Grow {...props} ref={ref} />;
});

interface AuctionModalProps {
    open: boolean;
    handleClose: () => void;
    userCardId: string;
}

function AddAuctionForm({ open, handleClose, userCardId }: AuctionModalProps) {
    const dispatch = useDispatch();

    const sessionUser = useSelector((state: RootState) => state.user);


    const [basePrice, setBasePrice] = useState('1');
    const [duration, setDuration] = useState('72');
    const [basePriceError, setBasePriceError] = useState(false);
    const [durationError, setDurationError] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [closing, setClosing] = useState(false);
    const [error, setError] = useState(false);
    const theme = useTheme();

    const handleCreateAuction = () => {
        let valid = true;

        if (isNaN(Number(basePrice)) || Number(basePrice) < 1) {
            setBasePriceError(true);
            valid = false;
        } else {
            setBasePriceError(false);
        }

        if (isNaN(Number(duration)) || Number(duration) < 24 || Number(duration) > 96) {
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
        addAuction(sessionUser.username, userCardId, Number(basePrice), Number(duration))
            .then(() => {
                setLoading(false);
                setSuccess(true);
                setError(false);

                setTimeout(() => {
                    setSuccess(false);
                    setClosing(true);

                    setTimeout(() => {
                        setClosing(false);
                        setConfirmDialogOpen(false);
                        handleClose();
                    }, 500);
                }, 2000);
            }).catch(() => {
                setError(true);
                setLoading(false);
                setSuccess(false);
                setConfirmDialogOpen(false);
            });
    };

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
                TransitionComponent={Transition}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    style: {
                        borderRadius: 15,
                        padding: '20px',
                        textAlign: 'center'
                    }
                }}
            >
                <DialogContent>
                    <Typography variant="h5" gutterBottom>
                        Crear subasta
                    </Typography>
                    <TextField
                        margin="dense"
                        id="cardId"
                        label="ID de la Carta"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={userCardId}
                        InputProps={{
                            readOnly: true,
                            style: {
                                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200]
                            }
                        }}
                    />
                    <Divider sx={{ margin: '20px 0' }}><Typography variant="subtitle1">Personalizar subasta</Typography></Divider>
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
                        helperText={basePriceError ? 'Por favor, introduce un precio base válido. Mínimo: 1 zen' : 'Valor predeterminado: 1 zen.'}
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
                        helperText={durationError ? 'Por favor, introduce una duración válida. Mínimo: 24 horas, Máximo: 96 horas' : 'Valor predeterminado: 72 horas.'}
                    />
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center' }}>
                    <Button onClick={handleClose}
                        buttonType='back'
                        label='Cancelar'
                    />
                    <Button onClick={handleCreateAuction}
                        buttonType='confirm'
                        label='Crear subasta'
                    />
                </DialogActions>
            </Dialog>

            <Dialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                aria-labelledby="confirm-dialog-title"
                TransitionComponent={Transition}
                maxWidth="sm"
                PaperProps={{
                    style: {
                        borderRadius: 15,
                        padding: '20px',
                        textAlign: 'center',
                        alignContent: 'center',
                        justifyContent: 'center'
                    }
                }}
            >

                {!loading && !success && !closing &&
                    <Grow in={!loading && !success && !closing} timeout={{ enter: 500, exit: 500 }}>
                        <DialogContent>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <WarningIcon style={{ fontSize: 50, color: theme.palette.warning.main }} />
                                <Typography variant="h4" gutterBottom>
                                    Confirmar subasta
                                </Typography>
                                <Typography variant="body2">ID de la Carta: {userCardId}</Typography>
                                <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
                                    <Typography variant="body2">Precio Base: {basePrice}</Typography>
                                    <img src="/zen.png" alt="Saldo del usuario en zens" style={{ width: '1.2em', marginLeft: 10, height: 'auto' }} />
                                </Box>
                                <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
                                    <Typography variant="body2">Duración: {duration} horas</Typography>
                                    <AccessTimeIcon sx={{ marginLeft: 1, color: theme.palette.info.main }} />
                                </Box>
                            </Box>
                        </DialogContent>
                    </Grow>
                }

                {loading && !closing && !success &&
                    <Grow in={loading} timeout={{ enter: 500, exit: 500 }}>
                        <DialogContent>
                            <Box display="flex" justifyContent="center">
                                <CircularProgress />
                            </Box>
                        </DialogContent>
                    </Grow>
                }

                {success && !loading && !closing &&
                    <Grow in={success} timeout={{ enter: 500, exit: 500 }}>
                        <DialogContent>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <CheckCircleIcon style={{ fontSize: 50, color: theme.palette.success.main }} />
                                <Typography variant="h6" gutterBottom>
                                    ¡Subasta creada!
                                </Typography>
                            </Box>
                        </DialogContent>
                    </Grow>
                }

                {error && !loading && !closing &&
                    <Grow in={error} timeout={{ enter: 500, exit: 500 }}>
                        <DialogContent>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <ErrorTwoTone style={{ fontSize: 50, color: theme.palette.error.main }} />
                                <Typography variant="h6" gutterBottom>
                                    Ha ocurrido un error, por favor inténtalo de nuevo.
                                </Typography>
                            </Box>
                        </DialogContent>
                    </Grow>
                }

                {!loading && !success && !closing && (
                    <DialogActions style={{ justifyContent: 'center' }}>
                        <Button onClick={() => setConfirmDialogOpen(false)}
                            buttonType='cancel'
                            label='Cancelar'
                        />
                        <Button onClick={handleConfirmAuction}
                            buttonType='confirm'
                            label='Confirmar'
                        />
                    </DialogActions>
                )}
            </Dialog>
        </div>
    );
}

export default AddAuctionForm;
