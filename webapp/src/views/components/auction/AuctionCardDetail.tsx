import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import TimerIcon from '@mui/icons-material/Timer';
import {
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
import { getCardFromAuction, getCardFromUserCollection, getShopTransactionsCard } from '../../../api/api';
import { resetUpdate } from '../../../redux/slices/updateSlice';
import { RootState } from '../../../redux/store';
import { CardStatus, Card as CardType, Transaction } from "../../../shared/sharedTypes";
import Button from '../buttons/Button';
import DurationButton from '../buttons/duration/DurationButton';
import GeneralCardDetail from '../cardDetail/GeneralCardDetail';
import ErrorMessageBox from '../error/ErrorMessageBox';
import WithdrawnAuctionForm from '../forms/auction/WithdrawnAuctionForm';



const AuctionCardDetail = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const dispatch = useDispatch();

    const { id } = useParams();
    const [card, setCard] = useState<CardType | null>(null);
    const [userCardId, setUserCardId] = useState<string | null>(null);
    const [duration, setDuration] = useState<number>(0);
    const [initialPrice, setInitialPrice] = useState<number>(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const [error, setError] = useState<string | null>(null);
    const [canBid, setCanBid] = useState<boolean>(false);
    const [onAuction, setOnAuction] = useState<boolean>(false);
    const [isOwner, setIsOwner] = useState<boolean>(false);

    const [openWithdrawnModal, setOpenWithdrawnModal] = useState(false);

    const handleOpenBid = () => navigate(`/bid/${id}`);



    const sessionUser = useSelector((state: RootState) => state.user);
    const { update, updateId } = useSelector((state: RootState) => state.update);
    const username = sessionUser.username.toLowerCase();

    const processCard = (id: string) => {
        const timer = setTimeout(() => {
            setError('Error: The request is taking too long to load.');
        }, 5000); // 5 segundos

        setOnAuction(false);

        getCardFromAuction(id)
            .then((data) => {
                clearTimeout(timer);
                setCard(data.item);
                setUserCardId(data._id);
                setDuration(data.duration);
                setInitialPrice(data.initialPrice);
                setCanBid(false);
                setOnAuction(true);
                setIsOwner(data.username === username);

                if (data.status === CardStatus.OnAuction && data.username == username) {
                    setCanBid(false);
                }
                if (data.status === CardStatus.OnAuction && data.username != username) {
                    setCanBid(true);
                }
                return getShopTransactionsCard(data._id);
            })
            .then(setTransactions)
            .catch((error) => {
                setOnAuction(false);
                clearTimeout(timer);
                setError(error.message || 'Error: An unexpected error occurred.');
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
            setOpenWithdrawnModal(false);
            return;
        }
        setOpenWithdrawnModal(true);
    }

    const handleWithdrawnClose = async () => {
        setOpenWithdrawnModal(false);
    }


    if (error || !onAuction && !isOwner) {
        return (
            <ErrorMessageBox />
        );
    }

    if (!onAuction && isOwner) {
        navigate(`/card/${userCardId}`);
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
            cardInformationChildren={onAuction && canBid ? (<CardActions>
                <Button
                    startIcon={<AddCircleOutlineIcon />}
                    variant="contained"
                    sx={{ marginTop: 2, marginBottom: 2 }}
                    fullWidth
                    buttonType="primary"
                    onClick={handleOpenBid}
                    label='Realizar puja'
                />
            </CardActions>)

                : (
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
                        {isOwner && onAuction && (
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
                        )}
                    </>)
            } />
    );
};

export default AuctionCardDetail;
