import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import TimerIcon from '@mui/icons-material/Timer';
import {
    Alert,
    Box,
    CardActions,
    CardContent,
    CircularProgress,
    Grid,
    Typography,
    useTheme
} from "@mui/material";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { checkActiveBid, getCardFromAuction, getCardFromUserCollection, getShopTransactionsCard } from '../../../../api/api';
import { resetUpdate } from '../../../../redux/slices/updateSlice';
import { RootState } from '../../../../redux/store';
import { Auction, CardStatus, Card as CardType, Transaction } from "../../../../shared/sharedTypes";
import Button from '../../buttons/Button';
import DurationButton from '../../buttons/duration/DurationButton';
import GeneralCardDetail from '../../cardDetail/GeneralCardDetail';
import Container from '../../container/Container';
import WithdrawnAuctionForm from '../../forms/auction/WithdrawnAuctionForm';
import AddBidForm from '../../forms/bid/AddBidForm';
import WithdrawnBidForm from '../../forms/bid/WithdrawnBidForm';
import ErrorMessageBox from '../../messagesBox/ErrorMessageBox';



export default function AuctionCardDetail() {
    const navigate = useNavigate();
    const theme = useTheme();
    const dispatch = useDispatch();

    const { id } = useParams();
    const [card, setCard] = useState<CardType | null>(null);
    const [userCardId, setUserCardId] = useState<string | null>(null);
    const [duration, setDuration] = useState<number>(0);
    const [initialPrice, setInitialPrice] = useState<number>(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [auction, setAuction] = useState<Auction | null>(null)

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [canBid, setCanBid] = useState<boolean>(false);
    const [onAuction, setOnAuction] = useState<boolean>(false);
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [haveBid, setHaveBid] = useState<boolean>(false);
    const [bidId, setBidId] = useState<string | null>(null)

    const [openWithdrawnModal, setOpenWithdrawnModal] = useState(false);
    const [openWithWarning, setOpenWithWarning] = useState(false);
    const [openBidModal, setOpenBidModal] = useState(false);


    const sessionUser = useSelector((state: RootState) => state.user);
    const { update, updateId } = useSelector((state: RootState) => state.update);
    const username = sessionUser.username.toLowerCase();

    /**
     * Función para procesar la carta
     * @param id 
     * @returns 
     */
    const processCard = (id: string) => {
        const timer = setTimeout(() => {
            setError('Actualmente no se puede obtener los datos de la subasta.');
        }, 5000); // 5 segundos

        setOnAuction(false);
        setBidId(null);
        setHaveBid(false);
        setLoading(true);

        getCardFromAuction(id)
            .then((data) => {
                clearTimeout(timer);
                setCard(data.item);
                setUserCardId(data._id);
                setDuration(data.duration);
                setInitialPrice(data.initialPrice);
                setCanBid(false);
                setAuction(data.auction);
                setIsOwner(data.username === username);
                if (data.status === CardStatus.OnAuction)
                    setOnAuction(true);
                else {
                    setOnAuction(false);
                    setLoading(false);
                    return;
                }
                if (data.status === CardStatus.OnAuction && data.username == username) {
                    setCanBid(false);
                }
                if (data.status === CardStatus.OnAuction && data.username != username) {
                    setCanBid(true);
                    checkActiveBid(username, data.auction).then((bid) => {
                        if (bid) {
                            setHaveBid(true);
                            setBidId(bid._id);
                            navigate(`/bids/${bid._id}`);
                        } else {
                            setHaveBid(false);
                            setBidId(null);
                        }
                    }).catch((error) => {
                        setError('Se ha producido un error al obtener los datos de la subasta.');
                    });
                }
                return getShopTransactionsCard(data._id);
            })
            .then(
                (data) => {
                    setTransactions(data);
                    setLoading(false);
                })
            .catch((error) => {
                setOnAuction(false);
                clearTimeout(timer);
                setLoading(false);
                setError('Se ha producido un error al obtener los datos de la subasta.');
            });

        return () => clearTimeout(timer);
    }


    useEffect(() => {
        if (update) {
            const timer = setTimeout(() => {
                processCard(id);
                dispatch(resetUpdate());
            }, 3000);
            return () => clearTimeout(timer);
        }

    }, [update]);

    useEffect(() => {
        processCard(id);
    }, [id, username]);

    /**
     * Función para comprobar si la carta está en subasta
     * @param id 
     * @returns 
     */
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

    /**
     * Función para abrir el modal de retirar subasta
     */
    const handleWithdrawnOpen = async () => {
        const canProceed = await checkAvailableCard(userCardId);
        if (!canProceed) {
            setOpenWithWarning(true);
        }
        setOpenWithdrawnModal(true);
    }

    /**
     * Función para cerrar el modal de retirar subasta
     */
    const handleWithdrawnClose = async () => {
        setOpenWithdrawnModal(false);
    }

    /**
     * Función para abrir el modal de retirar subasta
     */
    const handleOpenWithdrawnBidModal = async () => {
        if (!haveBid) {
            setOpenWithWarning(true);
        }
        handleWithdrawnOpen();
    }

    /**
     * Función para abrir el modal de puja
     */
    const handleOpenBid = async () => {
        if (haveBid) {
            setOpenWithWarning(true);
            setOpenBidModal(true);
            return;
        }
        const canProceed = await checkAvailableCard(userCardId);
        if (!canProceed) {
            setCanBid(false);
            return;
        }
        setOpenBidModal(true);
    }

    // ERROR
    if (error) {
        return (
            <ErrorMessageBox message='Se ha producido un error al obtener los datos de la subasta.' />
        );
    }

    // LOADING
    if (loading) {
        return <Container style={{ textAlign: 'center' }}><CircularProgress /></Container>;
    }


    return (
        <GeneralCardDetail title="Detalles de la subasta" backLabel="Volver a subastas" handleBack={() => navigate('/auctions')}
            card={card}
            id={id}
            transactions={transactions}
            pokemonBoxChildren={<DurationButton duration={duration} />}
            cardInformationChildren={onAuction && canBid && !haveBid ? (<CardActions>
                <Button
                    startIcon={<AddCircleOutlineIcon />}
                    variant="contained"
                    sx={{ marginTop: 2, marginBottom: 2 }}
                    fullWidth
                    buttonType="primary"
                    onClick={handleOpenBid}
                    label='Realizar puja'
                />
                <AddBidForm open={openBidModal} handleClose={() => setOpenBidModal(false)} warning={openWithWarning} auction={auction} />
            </CardActions>)

                : (
                    <>
                        {!isOwner && onAuction && haveBid && (
                            <CardActions>
                                <Button
                                    startIcon={<RemoveCircleOutlineIcon />}
                                    variant="contained"
                                    sx={{ marginTop: 2, marginBottom: 2 }}
                                    fullWidth
                                    onClick={handleOpenWithdrawnBidModal}
                                    buttonType="ghost"
                                    label='Retirar puja'
                                />
                                <WithdrawnBidForm bidId={bidId} open={openWithdrawnModal} handleClose={handleWithdrawnClose} warning={openWithWarning} />
                            </CardActions>
                        )}

                        {isOwner && onAuction && (
                            <>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h5" gutterBottom>Detalles de la subasta</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
                                                <Typography><strong>Precio inicial:</strong>  {initialPrice}</Typography>
                                                <img src="/zen.png" alt="Saldo del usuario en zens" style={{ width: '1.2em', marginLeft: 10, height: 'auto' }} />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
                                                <Typography><strong>Tiempo restante:</strong> {duration} horas</Typography>
                                                <TimerIcon sx={{ marginLeft: 1, color: theme.palette.info.main }} />
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        startIcon={<RemoveCircleOutlineIcon />}
                                        variant="contained"
                                        sx={{ marginTop: 2, marginBottom: 2 }}
                                        fullWidth
                                        onClick={handleWithdrawnOpen}
                                        buttonType="ghost"
                                        label='Retirar subasta'
                                    />
                                    <WithdrawnAuctionForm auctionId={id} open={openWithdrawnModal} handleClose={handleWithdrawnClose} />
                                </CardActions>
                            </>
                        )}

                        {isOwner && !onAuction && (
                            <Alert severity="success" sx={{ width: '100%', fontSize: '1.1em' }} >
                                La subasta se ha retirado con éxito.
                            </Alert>
                        )}
                    </>)
            } />
    );
};
// #endregion