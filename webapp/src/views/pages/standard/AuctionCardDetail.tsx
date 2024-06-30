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
import { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { checkActiveBid, getCardFromAuction, getCardFromUserCollection, getShopTransactionsCard } from '../../../api/api';
import { resetUpdate } from '../../../redux/slices/updateSlice';
import { RootState } from '../../../redux/store';
import { Auction, CardStatus, Card as CardType, Transaction } from "../../../shared/sharedTypes";
import Button from '../../components/buttons/Button';
import DurationButton from '../../components/buttons/duration/DurationButton';
import GeneralCardDetail from '../../components/cardDetail/GeneralCardDetail';
import Container from '../../components/container/Container';
import WithdrawnAuctionForm from '../../components/forms/auction/WithdrawnAuctionForm';
import AddBidForm from '../../components/forms/bid/AddBidForm';
import ErrorMessageBox from '../../components/messages/ErrorMessageBox';

// Botones memoizados para evitar renders innecesarios
const WithdrawAuctionButton = memo(({ id, handleWithdrawnOpen, openWithdrawnModal, handleWithdrawnClose, onAuction }: any) => (
    <>
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

    </>
));

const AddBidButton = memo(({ auction, openBidModal, openWithWarning, handleOpenBid, handleBidClose, canBid }: any) => (
    <>
        {canBid ? (
            <>
                <Button
                    startIcon={<AddCircleOutlineIcon />}
                    variant="contained"
                    sx={{ marginTop: 2, marginBottom: 2 }}
                    fullWidth
                    buttonType="primary"
                    onClick={handleOpenBid}
                    label='Realizar puja'
                />
                <AddBidForm open={openBidModal} handleClose={handleBidClose} warning={openWithWarning} auction={auction} />
            </>
        ) : (
            <Alert severity="success" sx={{ width: '100%', fontSize: '1.1em' }} role='alert' >
                ¡Puja realizada con éxito!
            </Alert>
        )}
    </>
));

// #region COMPONENT AuctionCardDetail
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
    const [auction, setAuction] = useState<Auction | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [canBid, setCanBid] = useState<boolean>(false);
    const [onAuction, setOnAuction] = useState<boolean>(false);
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [haveBid, setHaveBid] = useState<boolean>(false);
    const [openWithdrawnModal, setOpenWithdrawnModal] = useState(false);
    const [openWithWarning, setOpenWithWarning] = useState(false);
    const [openBidModal, setOpenBidModal] = useState(false);

    const sessionUser = useSelector((state: RootState) => state.user);
    const { update, updateId } = useSelector((state: RootState) => state.update);
    const username = sessionUser.username.toLowerCase();

    /**
     * Función para obtener los datos de la subasta
     * @param id 
     */
    const processCard = async (id: string) => {
        const timer = setTimeout(() => setError('Actualmente no se puede obtener los datos de la subasta.'), 5000);
        try {
            setLoading(true);
            const data = await getCardFromAuction(id);
            clearTimeout(timer);
            setCard(data.item);
            setUserCardId(data._id);
            setDuration(data.duration);
            setInitialPrice(data.initialPrice);
            setAuction(data.auction);
            setIsOwner(data.username.toLowerCase() === username);
            setOnAuction(data.status === CardStatus.OnAuction);

            checkActiveBid(username, data.auction).then((bid) => {
                if (bid) {
                    setHaveBid(true);
                    setCanBid(false);
                } else {
                    setCanBid(true);
                    setHaveBid(false);
                }
            }).catch(() => {
                setError('Se ha producido un error al obtener los datos de la subasta.');
            });
            const transactionsData = await getShopTransactionsCard(data._id);
            setTransactions(transactionsData);
        } catch (error) {
            clearTimeout(timer);
            setError('Se ha producido un error al obtener los datos de la subasta.');
        } finally {
            setLoading(false);
        }
    };

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
    }, [update, updateId, username, id]);

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
     * Función para abrir el modal de subasta
     */
    const handleWithdrawnOpen = useCallback(async () => {
        if (await checkAvailableCard(userCardId)) {
            setOpenWithdrawnModal(true);
        } else {
            setOpenWithWarning(true);
        }
    }, [userCardId]);

    /**
     * Función para cerrar el modal de subasta
     */
    const handleWithdrawnClose = useCallback(() => setOpenWithdrawnModal(false), []);

    /**
     * Función para abrir el modal de puja
     */
    const handleOpenBid = useCallback(async () => {
        if (haveBid) {
            setOpenWithWarning(true);
            setOpenBidModal(true);
            return;
        }
        if (await checkAvailableCard(userCardId)) {
            setOpenBidModal(true);
        } else {
            setCanBid(false);
        }
    }, [haveBid, userCardId]);

    /**
     * Función para cerrar el modal de puja
     */
    const handleBidClose = useCallback(() => setOpenBidModal(false), []);

    // ERROR
    if (error) {
        return <ErrorMessageBox message='Se ha producido un error al obtener los datos de la subasta.' />;
    }

    // LOADING
    if (loading) {
        return <Container style={{ textAlign: 'center' }}><CircularProgress /></Container>;
    }

    return (
        <GeneralCardDetail
            title="Detalles de la subasta"
            backLabel="Volver a subastas"
            handleBack={() => navigate('/auctions')}
            card={card}
            id={id}
            transactions={transactions}
            pokemonBoxChildren={<DurationButton duration={duration} />}
            cardInformationChildren={
                <>
                    {onAuction && !isOwner ? (
                        <CardActions>
                            <AddBidButton
                                auction={auction}
                                openBidModal={openBidModal}
                                openWithWarning={openWithWarning}
                                handleOpenBid={handleOpenBid}
                                handleBidClose={handleBidClose}
                                canBid={canBid}
                            />
                        </CardActions>
                    ) : (
                        <>
                            {isOwner && onAuction && (
                                <>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h3" gutterBottom sx={{ textAlign: 'center' }} >Detalles de la subasta</Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
                                                    <Typography><strong>Precio inicial:</strong> {initialPrice}</Typography>
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
                                        <WithdrawAuctionButton
                                            id={id}
                                            handleWithdrawnOpen={handleWithdrawnOpen}
                                            openWithdrawnModal={openWithdrawnModal}
                                            handleWithdrawnClose={handleWithdrawnClose}
                                            onAuction={onAuction}
                                        />
                                    </CardActions>
                                </>
                            )}
                            {isOwner && !onAuction && (
                                <Alert severity="success" sx={{ width: '100%', fontSize: '1.1em' }} role='alert' >
                                    La subasta se ha retirado con éxito.
                                </Alert>
                            )}
                        </>
                    )}
                </>
            }
        />
    );
}
