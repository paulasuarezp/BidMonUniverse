import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {
    Alert,
    Box,
    CardActions,
    CardContent,
    CircularProgress,
    Typography
} from "@mui/material";
import { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getCardFromBid, getCardFromUserCollection, getShopTransactionsCard } from '../../../../api/api';
import { resetUpdate } from '../../../../redux/slices/updateSlice';
import { RootState } from '../../../../redux/store';
import { BidStatus, CardStatus, Card as CardType, Transaction } from "../../../../shared/sharedTypes";
import Button from '../../buttons/Button';
import DurationButton from '../../buttons/duration/DurationButton';
import GeneralCardDetail from '../../cardDetail/GeneralCardDetail';
import Container from '../../container/Container';
import WithdrawnBidForm from '../../forms/bid/WithdrawnBidForm';
import ErrorMessageBox from '../../messagesBox/ErrorMessageBox';

// Botón de retirar puja con memo para evitar renders innecesarios
const WithdrawButton = memo(({ id, active, openWithdrawnModal, openWithWarning, handleWithdrawnOpen, handleWithdrawnClose }: any) => (
    active ? (
        <>
            <Button
                startIcon={<RemoveCircleOutlineIcon />}
                variant="contained"
                sx={{ marginTop: 2, marginBottom: 2 }}
                fullWidth
                onClick={handleWithdrawnOpen}
                buttonType="ghost"
                label='Retirar puja'
            />
            <WithdrawnBidForm
                bidId={id}
                open={openWithdrawnModal}
                handleClose={handleWithdrawnClose}
                warning={openWithWarning}
            />
        </>
    ) : (
        <Alert severity="success" sx={{ width: '100%', fontSize: '1.1em' }} >
            La puja se ha retirado con éxito.
        </Alert>
    )
));

// #region COMPONENT BidCardDetail
export default function BidCardDetail() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const [card, setCard] = useState<CardType | null>(null);
    const [userCardId, setUserCardId] = useState<string | null>(null);
    const [duration, setDuration] = useState<number>(0);
    const [amount, setAmount] = useState<number>(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [active, setActive] = useState<boolean>(false);
    const [openWithdrawnModal, setOpenWithdrawnModal] = useState(false);
    const [openWithWarning, setOpenWithWarning] = useState(false);

    const { username } = useSelector((state: RootState) => state.user);
    const { update, updateId } = useSelector((state: RootState) => state.update);

    /**
     * Función para obtener los datos de la puja
     * @param id 
     */
    const processCard = async (id: string) => {
        const timer = setTimeout(() => setError('Actualmente no se puede obtener los datos de la puja.'), 5000);
        try {
            setLoading(true);
            const data = await getCardFromBid(id);
            clearTimeout(timer);
            setCard(data.item);
            setUserCardId(data._id);
            setDuration(data.duration);
            setAmount(data.initialPrice);
            setIsOwner(data.username.toLowerCase() === username.toLowerCase() || (data.bid && data.bid.username.toLowerCase() === username.toLowerCase()));
            setActive(data.bid && data.bid.status === BidStatus.Pending);
            const transactionsData = await getShopTransactionsCard(data._id);
            setTransactions(transactionsData);
        } catch (error) {
            clearTimeout(timer);
            setError('Se ha producido un error al obtener los datos de la puja.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        processCard(id);
    }, [id, username]);

    useEffect(() => {
        if (update) {
            const timer = setTimeout(() => {
                processCard(id);
                dispatch(resetUpdate());
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [update, updateId, userCardId, id]);

    /**
     * Función para comprobar si la carta está disponible
     * @param id 
     * @returns 
     */
    const checkAvailableCard = async (id: string) => {
        try {
            const data = await getCardFromUserCollection(id);
            return data.status === CardStatus.OnAuction;
        } catch (error) {
            return false;
        }
    };

    /**
     * Función para abrir el modal de retirar puja
     */
    const handleWithdrawnOpen = useCallback(async () => {
        if (await checkAvailableCard(userCardId)) {
            setOpenWithdrawnModal(true);
        } else {
            setOpenWithWarning(true);
        }
    }, [userCardId]);

    /**
     * Función para cerrar el modal de retirar puja
     */
    const handleWithdrawnClose = useCallback(() => setOpenWithdrawnModal(false), []);

    // ERROR
    if (error) {
        return <ErrorMessageBox message='Se ha producido un error al obtener los datos de la puja.' />;
    }

    // LOADING
    if (loading) {
        return <Container style={{ textAlign: 'center' }}><CircularProgress /></Container>;
    }

    return (
        <GeneralCardDetail
            title="Detalles de la puja"
            backLabel="Volver a mis pujas"
            handleBack={() => navigate('/bids')}
            card={card}
            id={id}
            transactions={transactions}
            pokemonBoxChildren={<DurationButton duration={duration} />}
            cardInformationChildren={
                <>
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h5" gutterBottom>Detalles de la subasta</Typography>
                        <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
                            <Typography><strong>Cantidad de la puja:</strong> {amount}</Typography>
                            <img src="/zen.png" alt="Saldo del usuario en zens" style={{ width: '1.2em', marginLeft: 10, height: 'auto' }} />
                        </Box>
                    </CardContent>

                    {isOwner && (
                        <CardActions>
                            <WithdrawButton
                                id={id}
                                active={active}
                                openWithdrawnModal={openWithdrawnModal}
                                openWithWarning={openWithWarning}
                                handleWithdrawnOpen={handleWithdrawnOpen}
                                handleWithdrawnClose={handleWithdrawnClose}
                            />
                        </CardActions>
                    )}
                </>
            }
        />
    );
};
// #endregion