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
import { AccessLevel, CardStatus, Card as CardType, Transaction } from "../../../shared/sharedTypes";
import Button from '../../components/buttons/Button';
import GeneralCardDetail from '../../components/cardDetail/GeneralCardDetail';
import Container from '../../components/container/Container';
import WithdrawnAuctionForm from '../../components/forms/auction/WithdrawnAuctionForm';
import ErrorMessageBox from '../../components/messagesBox/ErrorMessageBox';

// #region COMPONENTE ADMINAUCTIONDETAIL
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

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [canWithdraw, setCanWithdraw] = useState<boolean>(false);
    const [onAuction, setOnAuction] = useState<boolean>(false);

    const [openWithdrawnModal, setOpenWithdrawnModal] = useState(false);
    const [openWithWarning, setOpenWithWarning] = useState(false);


    const sessionUser = useSelector((state: RootState) => state.user);
    const { update, updateId } = useSelector((state: RootState) => state.update);
    const username = sessionUser.username.toLowerCase();

    /**
     * Función para obtener los datos de la carta en subasta y las transacciones asociadas
     * @param id 
     * @returns 
     */
    const processCard = (id: string) => {
        setLoading(true);
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
                if (data.status === CardStatus.OnAuction && sessionUser.role == AccessLevel.Admin) {
                    setCanWithdraw(true);
                }
                return getShopTransactionsCard(data._id);
            })
            .then(setTransactions)
            .catch((error) => {
                setLoading(false);
                setOnAuction(false);
                clearTimeout(timer);
                setError('Se ha producido un error al obtener los datos de la subasta.');
            });

        return () => {
            clearTimeout(timer);
            setLoading(false);
        }
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

    /**
     * Comprueba si la carta está en subasta y se puede proceder a retirarla
     * @param id - id de la carta
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
     * Abre el diálogo para retirar la subasta
     */
    const handleWithdrawnOpen = async () => {
        const canProceed = await checkAvailableCard(userCardId);
        if (!canProceed) {
            setOpenWithWarning(true);
        }
        setOpenWithdrawnModal(true);
    }

    /**
     * Cierra el diálogo para retirar la subasta
     */
    const handleWithdrawnClose = async () => {
        setOpenWithdrawnModal(false);
    }


    // ERROR    
    if (error) {
        return (
            <ErrorMessageBox message={error} />
        );
    }

    // LOADING
    if (loading) {
        return (
            <Container style={{ textAlign: 'center' }}>
                <CircularProgress />
            </Container>
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
