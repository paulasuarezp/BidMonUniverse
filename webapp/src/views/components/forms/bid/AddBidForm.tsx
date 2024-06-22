import { Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withdrawAuction } from "../../../../api/auctionsAPI";
import { setUpdate } from "../../../../redux/slices/updateSlice";
import { RootState } from "../../../../redux/store";
import { Auction } from "../../../../shared/sharedTypes";
import BaseForm from "../BaseForm";

function AddBidForm({ open, handleClose, auctionId }) {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state: RootState) => state.user.username);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    let successMessage = '¡Subasta retirada con éxito!';

    const handleConfirmAuction = async () => {
        setLoading(true);
        try {
            let auction: Auction = await withdrawAuction(sessionUser, auctionId);
            dispatch(setUpdate({ update: true, updateId: auction.card }));
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
            title="Retirar subasta"
            content={<Typography>¿Estás seguro que deseas retirar esta subasta?</Typography>}
            loading={loading}
            error={error}
            successMessage={success && successMessage}
            actions={[
                { onClick: handleClose, label: 'Cancelar', buttonType: 'cancel' },
                { onClick: handleConfirmAuction, label: 'Confirmar', buttonType: 'confirm' }
            ]}
        />
    );
}

export default AddBidForm;
