import { Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withdrawBid } from "../../../../api/bidsAPI";
import { setUpdate } from "../../../../redux/slices/updateSlice";
import { RootState } from "../../../../redux/store";
import { Bid } from "../../../../shared/sharedTypes";
import BaseForm from "../BaseForm";

interface WithdrawnBidFormProps {
    open: boolean;
    handleClose: () => void;
    warning?: boolean;
    auctionId: string;
}

function WithdrawnBidForm({ open, handleClose, warning = false, bidId }) {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state: RootState) => state.user.username);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    let successMessage = '¡Puja retirada con éxito!';
    let warningMessage = 'La puja no se puede retirar porque la subasta ya ha finalizado, ha sido cancelada o ya has retirado la puja.';


    const handleConfirmWithdrawn = async () => {
        setLoading(true);
        try {
            let bid: Bid = await withdrawBid(sessionUser, bidId);
            dispatch(setUpdate({ update: true, updateId: bid.usercard }));
            setSuccess(true);
            setLoading(false);
            setTimeout(() => {
                handleClose(); // Cerrar después del mensaje de éxito
            }, 2000); // Espera 2 segundos para mostrar el mensaje de éxito
        } catch (err) {
            setError('Ha ocurrido un error, por favor inténtalo de nuevo.');
            setLoading(false);
        }
    };

    return (
        <BaseForm
            open={open}
            onClose={handleClose}
            title="Retirar puja"
            content={<Typography>¿Estás seguro que deseas retirar la puja?</Typography>}
            loading={loading}
            error={error}
            warning={warning && warningMessage}
            successMessage={success && successMessage}
            actions={[
                { onClick: handleClose, label: 'Cancelar', buttonType: 'cancel' },
                { onClick: handleConfirmWithdrawn, label: 'Confirmar', buttonType: 'confirm' }
            ]}
        />

    );
}

export default WithdrawnBidForm;
