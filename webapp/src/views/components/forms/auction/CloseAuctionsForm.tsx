import { Alert, Typography } from "@mui/material";
import { useState } from "react";
import Swal from "sweetalert2";
import { getAuctionCards } from "../../../../api/api";
import { checkAllActiveAuctions } from "../../../../api/auctionsAPI";
import BaseForm from "../BaseForm";
import CloseAuctionsModal from "./CloseAuctionsModal";

export default function CloseAuctionsForm({ open, handleClose, openWithWarning = false }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showCards, setShowCards] = useState(false);
    const [cards, setCards] = useState([]);
    const [showForm, setShowForm] = useState(true);

    let successMessage = '¡Subastas cerradas con éxito!';

    const handleCloseShowCards = () => setShowCards(false);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            let auctions = await checkAllActiveAuctions();
            if (auctions.length === 0 && open) {
                setShowForm(false);
                setCards([]);
                setSuccess(true);
                setLoading(false);
                setShowCards(false);
                Swal.fire({
                    icon: 'info',
                    title: 'No hay subastas para cerrar',
                    text: 'En este momento no hay subastas finalizadas para cerrar.',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#81c784',
                });
            } else {
                const cardsData = await getAuctionCards(auctions);
                for (let card of cardsData) {
                    card.initialPrice = card.auction.finalPrice;
                }
                setCards(cardsData);
                setSuccess(true);
                setLoading(false);
                setShowCards(true);
                setShowForm(true);
            }
            setTimeout(() => {
                handleClose(); // Cerrar después del mensaje de éxito
            }, 2000); // Espera 2 segundos para mostrar el mensaje de éxito
        } catch (err) {
            setError('Ha ocurrido un error, por favor inténtalo de nuevo.');
            setLoading(false);
        }
    };

    return (
        <>
            {showForm && (
                <BaseForm
                    open={open}
                    onClose={handleClose}
                    title="Cerrar subastas"
                    content={
                        <>
                            <Typography>¿Estás seguro que deseas cerrar las subastas finalizadas?</Typography>
                            <Alert severity="info" role="alert">
                                <Typography>Para las subastas finalizadas, se buscará automáticamente al ganador y se enviará una notificación a los participantes.</Typography>
                            </Alert>
                            <Alert severity="warning" role="alert">
                                <Typography>Esta acción no se puede deshacer.</Typography>
                            </Alert>
                        </>
                    }
                    loading={loading}
                    error={error && 'Ha ocurrido un error al cerrar las subastas, por favor inténtalo de nuevo.'}
                    warning={openWithWarning && 'No se pueden cerrar las subastas en este momento. Por favor, inténtalo más tarde.'}
                    successMessage={success && successMessage}
                    actions={[
                        { onClick: handleClose, label: 'Cancelar', buttonType: 'cancel' },
                        { onClick: handleConfirm, label: 'Confirmar', buttonType: 'confirm' }
                    ]}
                />
            )}
            <CloseAuctionsModal cards={cards} open={showCards} handleClose={handleCloseShowCards} />
        </>
    );
}
