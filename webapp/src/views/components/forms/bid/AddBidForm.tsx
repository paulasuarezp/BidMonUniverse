import { Alert, Box, InputAdornment, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkActiveBid } from "../../../../api/api";
import { addBid } from "../../../../api/bidsAPI";
import { setUpdate } from "../../../../redux/slices/updateSlice";
import { RootState } from "../../../../redux/store";
import { Auction, Bid } from "../../../../shared/sharedTypes";
import BaseForm from "../BaseForm";

// #region PROPS
interface AddBidFormProps {
    open: boolean;
    handleClose: () => void;
    warning?: boolean;
    auction: Auction;
}
// #endregion

// #region COMPONENT AddBidForm
// Formulario para añadir una puja
export default function AddBidForm({ open, handleClose, warning, auction }: AddBidFormProps) {
    const dispatch = useDispatch();

    const sessionUser = useSelector((state: RootState) => state.user.username);

    const auctionId = auction._id;

    const [amount, setAmount] = useState('1');
    const [amountError, setAmountError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

    /**
     * Función para manejar el click en el botón de pujar
     * @returns 
     */
    const handleClick = () => {
        if (Number(amount) < 1) {
            setAmountError(true);
            return;
        }
        setConfirmDialogOpen(true);
    };

    // Contenido del formulario
    const content = (
        <Box>

            <Typography sx={{ marginBottom: 2 }}>
                Introduce la cantidad que deseas pujar.
            </Typography>
            <TextField
                margin="dense"
                id="basePrice"
                label="Cantidad a pujar"
                type="number"
                variant="outlined"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                error={amountError}
                helperText={amountError ? 'Por favor, introduce una cantidad válida para pujar. Mínimo: 1 zen' : 'La cantidad mínima para pujar es 1 zen'}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <img src={`/zen.png`} alt="zen icon" style={{ width: 24, height: 24 }} />
                        </InputAdornment>
                    ),
                    inputProps: { step: 10 },
                }}
            />
            <Alert severity="info" sx={{ mt: 2 }}>
                La cantidad se descontará de tu saldo solo si ganas la subasta.
            </Alert>
        </Box>

    );

    // Contenido de la confirmación
    const confirmationContent = (
        <Box display="flex" alignItems="center" justifyContent="center" mt={1} flexDirection='column'>
            <Typography>¿Estás seguro de que deseas realizar esta puja?</Typography>
            <TextField
                margin="dense"
                id="basePrice"
                label="Cantidad a pujar"
                type="number"
                disabled
                variant="outlined"
                value={amount}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <img src={`/zen.png`} alt="zen icon" style={{ width: 24, height: 24 }} />
                        </InputAdornment>
                    ),
                    inputProps: { step: 10 },
                }}
            />
        </Box>

    );

    /**
     * Función para confirmar la puja
     * @returns 
     */
    const handleConfirmAuction = async () => {
        setLoading(true);
        try {
            let previousBid: Bid = await checkActiveBid(sessionUser, auction);

            if (previousBid) {
                setError("Ya has realizado una puja en esta subasta.");
                setLoading(false);
                return;
            }

            let bid: Bid = await addBid(sessionUser, auctionId, Number(amount));
            dispatch(setUpdate({ update: true, updateId: bid.usercard }));
            setSuccessMessage("¡Puja creada con éxito!");
            setLoading(false);
            setTimeout(() => {
                setConfirmDialogOpen(false);
                handleClose(); // Cierra el formulario después de mostrar el éxito
            }, 2000);
        } catch (err) {
            setError("Error al crear la puja. Por favor, inténtalo de nuevo.");
            setLoading(false);
        }
    };

    return (
        <>
            {/* Notificación de error si ya existe una puja previa */}
            {error &&
                <BaseForm
                    open={open}
                    onClose={handleClose}
                    title="Error"
                    content={<Typography>Ya has realizado una puja en esta subasta.</Typography>}
                    loading={loading}
                    error={error}
                    actions={[
                        { label: "Cerrar", onClick: handleClose, buttonType: 'confirm' }
                    ]}
                />
            }
            <BaseForm
                open={open}
                onClose={handleClose}
                title="Realizar una puja"
                content={content}
                loading={loading}
                warning={warning && 'Ya has realizado una puja en esta subasta.'}
                error={error}
                successMessage={successMessage}
                actions={[
                    { label: "Cancelar", onClick: handleClose, buttonType: 'cancel' },
                    { label: "Crear puja", onClick: handleClick, buttonType: 'confirm' }
                ]}
            />
            <BaseForm
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                title="Confirmar puja"
                content={confirmationContent}
                loading={loading}
                successMessage={successMessage}
                showIcon='warning'
                actions={[
                    { label: "Volver", onClick: () => setConfirmDialogOpen(false), buttonType: 'back' },
                    { label: "Confirmar", onClick: handleConfirmAuction, buttonType: 'confirm' }
                ]}
            />
        </>
    );
}
// #endregion