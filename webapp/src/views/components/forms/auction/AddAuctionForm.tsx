import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Box, Divider, InputAdornment, TextField, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCardFromUserCollection } from "../../../../api/api";
import { addAuction } from "../../../../api/auctionsAPI";
import { setUpdate } from "../../../../redux/slices/updateSlice";
import { RootState } from "../../../../redux/store";
import { CardStatus } from "../../../../shared/sharedTypes";
import BaseForm from "../BaseForm";

// #region PROPS
interface AuctionModalProps {
    open: boolean;
    handleClose: () => void;
    userCardId: string;
}
// #endregion

// #region COMPONENT AddAuctionForm
// Formulario para añadir una subasta
export default function AddAuctionForm({ open, handleClose, userCardId }: AuctionModalProps) {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state: RootState) => state.user);
    const theme = useTheme();

    const [basePrice, setBasePrice] = useState('1');
    const [duration, setDuration] = useState('72');
    const [basePriceError, setBasePriceError] = useState(false);
    const [durationError, setDurationError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [warning, setWarning] = useState('');

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

    const handleConfirmAuction = async () => {
        setLoading(true);
        const canProceed = await checkAvailableCard(userCardId);
        if (!canProceed) {
            setLoading(false);
            setWarning('¡Ya tienes una subasta activa para esta carta!');
        } else {
            try {
                await addAuction(sessionUser.username, userCardId, Number(basePrice), Number(duration));
                setLoading(false);
                setSuccessMessage('¡Subasta creada!');
                dispatch(setUpdate({ update: true, updateId: userCardId }));

                setTimeout(() => {
                    setSuccessMessage('');
                    handleClose();
                    setConfirmDialogOpen(false);
                }, 2000);
            } catch {
                setError('Ha ocurrido un error, por favor inténtalo de nuevo.');
                setLoading(false);
            }
        }
    };

    const checkAvailableCard = async (id: string) => {
        try {
            const data = await getCardFromUserCollection(id);
            return data.status !== CardStatus.OnAuction;
        } catch (error) {
            return false;
        }
    };

    const content = (
        <Box>
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
                aria-readonly="true"
            />
            <Divider sx={{ margin: '20px 0' }}><Typography variant="subtitle1">Personalizar subasta</Typography></Divider>
            <TextField
                margin="dense"
                id="basePrice"
                label="Precio inicial"
                type="number"
                fullWidth
                variant="outlined"
                value={basePrice}
                onChange={e => setBasePrice(e.target.value)}
                error={basePriceError}
                helperText={basePriceError ? 'Por favor, introduce un precio base válido. Mínimo: 1 zen' : 'Valor predeterminado: 1 zen.'}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <img src={`/zen.png`} alt="Icono de Zen" style={{ width: 24, height: 24 }} />
                        </InputAdornment>
                    ),
                    inputProps: { step: 10 },
                }}
                aria-invalid={basePriceError}
                aria-describedby={basePriceError ? 'basePrice-error-text' : null}
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
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <AccessTimeIcon sx={{ color: theme.palette.info.main }} />
                        </InputAdornment>
                    ),
                    inputProps: { step: 10 },
                }}
                aria-invalid={durationError}
                aria-describedby={durationError ? 'duration-error-text' : null}
            />
        </Box>
    );

    const confirmationContent = (
        <Box>
            <Typography>ID de la Carta: <strong>{userCardId}</strong></Typography>
            <Divider sx={{ margin: '20px 0' }}><Typography variant="subtitle1">Datos de la subasta</Typography></Divider>
            <TextField
                margin="dense"
                id="basePriceConfirm"
                label="Precio inicial confirmación"
                type="number"
                disabled
                fullWidth
                variant="outlined"
                value={basePrice}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <img src={`/zen.png`} alt="Icono de Zen" style={{ width: 24, height: 24 }} />
                        </InputAdornment>
                    ),
                    inputProps: { step: 10 },
                }}
                aria-labelledby="basePriceConfirm-label"
            />
            <TextField
                margin="dense"
                id="durationConfirm"
                label="Duración (horas) confirmación"
                type="number"
                disabled
                fullWidth
                variant="outlined"
                value={duration}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <AccessTimeIcon sx={{ color: theme.palette.info.main }} />
                        </InputAdornment>
                    ),
                    inputProps: { step: 10 },
                }}
                aria-labelledby="durationConfirm-label"
            />
        </Box>
    );

    return (
        <>
            <BaseForm
                open={open}
                onClose={handleClose}
                title="Crear subasta"
                content={content}
                loading={loading}
                error={error}
                successMessage={successMessage}
                actions={[
                    { label: "Cancelar", onClick: handleClose, buttonType: 'cancel' },
                    { label: "Crear subasta", onClick: handleCreateAuction, buttonType: 'confirm' }
                ]}
                showIcon={error ? 'error' : successMessage ? 'success' : warning ? 'warning' : 'none'}
            />
            <BaseForm
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                title="Confirmar subasta"
                content={confirmationContent}
                loading={loading}
                error={error}
                successMessage={successMessage}
                actions={[
                    { label: 'Volver', onClick: () => setConfirmDialogOpen(false), buttonType: 'back' },
                    { label: 'Confirmar', onClick: handleConfirmAuction, buttonType: 'confirm' }
                ]}
                showIcon="warning"
            />
        </>
    );
}
// #endregion
