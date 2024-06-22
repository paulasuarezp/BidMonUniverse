import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {
    Box,
    CardActions,
    CardContent,
    CircularProgress,
    Typography
} from "@mui/material";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getCardFromBid, getCardFromUserCollection, getShopTransactionsCard } from '../../../../api/api';
import { resetUpdate } from '../../../../redux/slices/updateSlice';
import { RootState } from '../../../../redux/store';
import { BidStatus, CardStatus, Card as CardType, Transaction } from "../../../../shared/sharedTypes";
import Button from '../../buttons/Button';
import DurationButton from '../../buttons/duration/DurationButton';
import GeneralCardDetail from '../../cardDetail/GeneralCardDetail';
import ErrorMessageBox from '../../error/ErrorMessageBox';
import WithdrawnBidForm from '../../forms/bid/WithdrawnBidForm';



const BidCardDetail = () => {
    const dispatch = useDispatch();

    const { id } = useParams();
    const [card, setCard] = useState<CardType | null>(null);
    const [userCardId, setUserCardId] = useState<string | null>(null);
    const [duration, setDuration] = useState<number>(0);
    const [amount, setAmount] = useState<number>(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const [error, setError] = useState<string | null>(null);
    const [onAuction, setOnAuction] = useState<boolean>(false);
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [active, setActive] = useState<boolean>(false);

    const [openWithdrawnModal, setOpenWithdrawnModal] = useState(false);
    const [openWithWarning, setOpenWithWarning] = useState(false);


    const sessionUser = useSelector((state: RootState) => state.user);
    const { update, updateId } = useSelector((state: RootState) => state.update);
    const username = sessionUser.username.toLowerCase();

    const processCard = (id: string) => {
        const timer = setTimeout(() => {
            setError('Error: The request is taking too long to load.');
        }, 5000); // 5 segundos

        setOnAuction(false);
        setIsOwner(false);

        getCardFromBid(id)
            .then((data) => {
                clearTimeout(timer);
                setCard(data.item);
                setUserCardId(data._id);
                setDuration(data.duration);
                setAmount(data.initialPrice);
                setOnAuction(true);
                setIsOwner(data.username === username);
                if (data.bid && data.bid.username === username) {
                    setIsOwner(true);
                }
                if (data.status === CardStatus.OnAuction && data.bid && data.bid.status === BidStatus.Pending) {
                    setActive(true);
                } else {
                    setActive(false);
                }

                return getShopTransactionsCard(data._id);
            })
            .then(setTransactions)
            .catch((error) => {
                setOnAuction(false);
                clearTimeout(timer);
                setError(error.message || 'Se ha producido un error al obtener los datos de la subasta.');
            });

        return () => clearTimeout(timer);
    }


    useEffect(() => {
        if (update && updateId === userCardId) {
            processCard(id);
            dispatch(resetUpdate());
        }

    }, [update, updateId]);

    useEffect(() => {
        processCard(id);
    }, [id, username]);

    const checkAvailableCard = async (id: string) => {
        try {
            const data = await getCardFromUserCollection(id);
            if (data.status !== CardStatus.OnAuction) {
                return false; // Retorna false para indicar que no se debe proceder
            }
            return true; // Retorna true si la carta está en subasta y se puede proceder
        } catch (error) {
            return false; // Retorna false en caso de error al obtener los datos de la carta
        }
    };

    const handleWithdrawnOpen = async () => {
        const canProceed = await checkAvailableCard(userCardId);
        if (!canProceed) {
            setOpenWithWarning(true);
        }
        setOpenWithdrawnModal(true);
    }

    const handleWithdrawnClose = async () => {
        setOpenWithdrawnModal(false);
    }

    const openWithdrawnBidModal = async () => {
        if (!active) {
            setOpenWithWarning(true);
        }
        handleWithdrawnOpen();
    }

    if (error || !onAuction && !isOwner) {
        return (
            <ErrorMessageBox message={error || 'Se ha producido un error al obtener los datos de la subasta.'} />
        );
    }

    if (!card) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <GeneralCardDetail
            card={card}
            id={id}
            transactions={transactions}
            pokemonBoxChildren={<DurationButton duration={duration} />}
            cardInformationChildren={
                <>
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h5" gutterBottom>Detalles de la subasta</Typography>
                        <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
                            <Typography><strong>Cantidad de la puja:</strong>  {amount}</Typography>
                            <img src="/zen.png" alt="Saldo del usuario en zens" style={{ width: '1.2em', marginLeft: 10, height: 'auto' }} />
                        </Box>
                    </CardContent>

                    {isOwner && active && (
                        <CardActions>
                            <Button
                                startIcon={<RemoveCircleOutlineIcon />}
                                variant="contained"
                                sx={{ marginTop: 2, marginBottom: 2 }}
                                fullWidth
                                onClick={openWithdrawnBidModal}
                                buttonType="ghost"
                                label='Retirar puja'
                            />
                            <WithdrawnBidForm bidId={id} open={openWithdrawnModal} handleClose={handleWithdrawnClose} warning={openWithWarning} />
                        </CardActions>
                    )}
                </>
            } />
    );
};

export default BidCardDetail;
