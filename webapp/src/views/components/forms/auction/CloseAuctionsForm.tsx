import { Typography } from "@mui/material";
import { useState } from "react";
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

    let successMessage = '¡Subastas cerradas con éxito!';

    const handleCloseShowCards = () => setShowCards(false);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            let auctions = await checkAllActiveAuctions();
            const cardsData = await getAuctionCards(auctions);
            for (let card of cardsData) {
                card.initialPrice = card.auction.finalPrice;
            }
            setCards(cardsData);
            setSuccess(true);
            setLoading(false);
            setShowCards(true);
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
            <BaseForm
                open={open}
                onClose={handleClose}
                title="Retirar subasta"
                content={<Typography>¿Estás seguro que deseas cerrar las subastas finalizadas?</Typography>}
                loading={loading}
                error={error && 'Ha ocurrido un error al cerrar las subastas, por favor inténtalo de nuevo.'}
                warning={openWithWarning && 'No se pueden cerrar las subastas en este momento. Por favor, inténtalo más tarde.'}
                successMessage={success && successMessage}
                actions={[
                    { onClick: handleClose, label: 'Cancelar', buttonType: 'cancel' },
                    { onClick: handleConfirm, label: 'Confirmar', buttonType: 'confirm' }
                ]}
            />
            <CloseAuctionsModal cards={cards} open={showCards} handleClose={handleCloseShowCards} />
        </>
    );
}
