import { Box, TextField, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkActiveBid } from "../../../../api/api";
import { addBid } from "../../../../api/bidsAPI";
import { setUpdate } from "../../../../redux/slices/updateSlice";
import { RootState } from "../../../../redux/store";
import { Auction, Bid } from "../../../../shared/sharedTypes";
import BaseForm from "../BaseForm";

interface WithdrawnBidFormProps {
    open: boolean;
    handleClose: () => void;
    warning?: boolean;
    auction: Auction;
}

function AddBidForm({ open, handleClose, warning, auction }: WithdrawnBidFormProps) {
    const dispatch = useDispatch();
    const theme = useTheme();

    const sessionUser = useSelector((state: RootState) => state.user.username);

    const auctionId = auction._id;

    const [amount, setAmount] = useState('1');
    const [amountError, setAmountError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

    const handleClick = () => {
        if (Number(amount) < 1) {
            setAmountError(true);
            return;
        }
        setConfirmDialogOpen(true);
    };

    const content = (
        <>
            <Typography variant="body1"> La cantidad se descontará de tu saldo solo si ganas la subasta.</Typography>
            <Typography variant="body2">Introduce la cantidad que deseas pujar. La cantidad mínima para pujar es 1 zen.</Typography>
            <TextField
                margin="dense"
                id="basePrice"
                label="Cantidad a pujar"
                type="number"
                fullWidth
                variant="outlined"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                error={amountError}
                helperText={amountError ? 'Por favor, introduce una cantidad válida para pujar. Mínimo: 1 zen' : 'Valor predeterminado: 1 zen.'}
            />
        </>
    );


    const confirmationContent = (
        <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
            <Typography variant="body2">¿Estás seguro de que deseas pujar?</Typography>
            <Typography variant="body2">Cantidad a pujar: {amount}</Typography>
            <img src="/zen.png" alt="icono zens" style={{ width: '1.2em', marginLeft: 10, height: 'auto' }} />
        </Box>

    );

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
                error={error}
                successMessage={successMessage}
                showIcon='warning'
                actions={[
                    { label: "Editar", onClick: () => setConfirmDialogOpen(false), buttonType: 'back' },
                    { label: "Confirmar", onClick: handleConfirmAuction, buttonType: 'confirm' }
                ]}
            />
        </>
    );
}

export default AddBidForm;
