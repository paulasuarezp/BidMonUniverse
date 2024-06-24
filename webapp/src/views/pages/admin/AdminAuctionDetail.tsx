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
import { AccessLevel, Auction, CardStatus, Card as CardType, Transaction } from "../../../shared/sharedTypes";
import ErrorMessageBox from '../../components/MessagesBox/ErrorMessageBox';
import Button from '../../components/buttons/Button';
import GeneralCardDetail from '../../components/cardDetail/GeneralCardDetail';
import WithdrawnAuctionForm from '../../components/forms/auction/WithdrawnAuctionForm';


export default function AdminAuctionDetail() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();

    const { id } = useParams();
    const [card, setCard] = useState<CardType | null>(null);
    const [userCardId, setUserCardId] = useState<string | null>(null);
    const [duration, setDuration] = useState<number>(0);
    const [initialPrice, setInitialPrice] = useState<number>(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [auction, setAuction] = useState<Auction | null>(null)

    const [error, setError] = useState<string | null>(null);
    const [canWithdraw, setCanWithdraw] = useState<boolean>(false);
    const [onAuction, setOnAuction] = useState<boolean>(false);

    const [openWithdrawnModal, setOpenWithdrawnModal] = useState(false);
    const [openWithWarning, setOpenWithWarning] = useState(false);
    const [openBidModal, setOpenBidModal] = useState(false);


    const sessionUser = useSelector((state: RootState) => state.user);
    const { update, updateId } = useSelector((state: RootState) => state.update);
    const username = sessionUser.username.toLowerCase();

    const processCard = (id: string) => {
        const timer = setTimeout(() => {
            setError('El servidor está tardando demasiado en responder. Por favor, inténtalo de nuevo más tarde.');
        }, 5000); // 5 segundos

        setOnAuction(false);
        setCanWithdraw(false);

        getCardFromAuction(id)
            .then((data) => {
                clearTimeout(timer);
                setCard(data.item);
                setUserCardId(data._id);
                setDuration(data.duration);
                setInitialPrice(data.initialPrice);
                setOnAuction(true);
                setAuction(data.auction);
                if (data.status === CardStatus.OnAuction && sessionUser.role == AccessLevel.Admin) {
                    setCanWithdraw(true);
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
        if (update) {
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


    if (error) {
        return (
            <ErrorMessageBox />
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
        <GeneralCardDetail title="Mi colección" backLabel="Volver a mi colección" handleBack={() => navigate("/album")}
            card={card}
            id={id}
            transactions={transactions}
            pokemonBoxChildren={null}
            cardInformationChildren={
                canWithdraw && onAuction && (
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
                        </CardActions>
                    </>
                )
            }

            form={<WithdrawnAuctionForm auctionId={id} open={openWithdrawnModal} openWithWarning={openWithWarning} handleClose={handleWithdrawnClose} />}
        />
    );
};
