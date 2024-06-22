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
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getCardFromAuction, getShopTransactionsCard } from '../../../api/api';
import { RootState } from '../../../redux/store';
import { CardStatus, Card as CardType, Transaction } from "../../../shared/sharedTypes";
import Button from '../buttons/Button';
import DurationButton from '../buttons/duration/DurationButton';
import GeneralCardDetail from '../cardDetail/GeneralCardDetail';
import ErrorMessageBox from '../error/ErrorMessageBox';



const AuctionCardDetail = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    const { id } = useParams();
    const [card, setCard] = useState<CardType | null>(null);
    const [duration, setDuration] = useState<number>(0);
    const [initialPrice, setInitialPrice] = useState<number>(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const [error, setError] = useState<string | null>(null);
    const [canBid, setCanBid] = useState<boolean>(false);

    const handleOpenBid = () => navigate(`/bid/${id}`);


    const sessionUser = useSelector((state: RootState) => state.user);
    const username = sessionUser.username.toLowerCase();


    useEffect(() => {
        const timer = setTimeout(() => {
            setError('Error: The request is taking too long to load.');
        }, 5000); // 5 segundos

        getCardFromAuction(id)
            .then((data) => {
                clearTimeout(timer);
                setCard(data.item);
                setDuration(data.duration);
                setInitialPrice(data.initialPrice);
                setCanBid(false);

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
                clearTimeout(timer);
                setError(error.message || 'Error: An unexpected error occurred.');
            });

        return () => clearTimeout(timer);
    }, [id, username]);

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
        <GeneralCardDetail
            card={card}
            id={id}
            transactions={transactions}
            pokemonBoxChildren={<DurationButton duration={duration} />}
            cardInformationChildren={canBid ? (<CardActions>
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

                        <CardActions>


                            <Button
                                startIcon={<RemoveCircleOutlineIcon />}
                                variant="contained"
                                sx={{ marginTop: 2, marginBottom: 2 }}
                                fullWidth
                                buttonType="ghost"
                                label='Retirar subasta'
                            />
                        </CardActions>
                    </>)
            } />
    );
};

export default AuctionCardDetail;
