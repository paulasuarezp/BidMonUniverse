import {
    Box,
    Grow, GrowProps,
    Typography,
    useTheme
} from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { purchaseCardPack } from '../../../../api/purchaseAPI';
import { updateBalance } from '../../../../redux/slices/userSlice';
import { RootState } from '../../../../redux/store';
import { Card, CardPack } from '../../../../shared/sharedTypes';
import PurchasedCardsModal from '../../cardpack/PurchasedCardsModal';
import BaseForm from '../BaseForm';

const Transition = React.forwardRef(function Transition(
    props: GrowProps & { children: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
) {
    return <Grow {...props} ref={ref} />;
});

interface PurchaseCardpackConfirmProps {
    open: boolean;
    handleClose: () => void;
    cardpack: CardPack;
}

export default function PurchaseCardpackConfirm({ open, handleClose, cardpack }: PurchaseCardpackConfirmProps) {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state: RootState) => state.user);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showCards, setShowCards] = useState(false);
    const [cards, setCards] = useState<Card[]>([]);
    const theme = useTheme();

    let id = cardpack._id;


    const confirmationContent = (
        <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
            <Typography variant="body2">Precio: {cardpack.price}</Typography>
            <img src="/zen.png" alt="Saldo del usuario en zens" style={{ width: '1.2em', marginLeft: 10, height: 'auto' }} />
        </Box>

    );

    const handleCloseShowCards = () => setShowCards(false);

    const handleConfirm = async () => {
        setLoading(true);
        setShowCards(false);
        try {
            let { cards } = await purchaseCardPack(sessionUser.username, cardpack.cardPackId);

            if (!cards) {
                setError('No se ha podido comprar el sobre. Por favor, inténtalo de nuevo.');
                setLoading(false);
                return;
            }

            setCards(cards);

            console.log("Sobre comprado con éxito");
            console.log("cartas generadas: ", cards);
            setShowCards(true);
            dispatch(updateBalance(sessionUser.balance - cardpack.price));
            setSuccessMessage("¡Sobre comprado con éxito!");

            setTimeout(() => {
                setShowCards(true);
                handleClose(); // Cierra el formulario después de mostrar el éxito
            }, 2000);
        } catch (err) {
            setError(err.message);
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
                    content={<Typography>No se ha podido comprar el sobre. Por favor, inténtalo de nuevo.</Typography>}
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
                title="Confirmar compra"
                content={confirmationContent}
                loading={loading}
                error={error}
                successMessage={successMessage}
                actions={[
                    { label: "Cancelar", onClick: handleClose, buttonType: 'cancel' },
                    { label: "Confirmar", onClick: handleConfirm, buttonType: 'confirm' }
                ]}
            />
            <PurchasedCardsModal cards={cards} open={showCards} handleClose={handleClose} />
        </>
    );
}

