import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {
    Box,
    Card,
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
import { capitalizeFirstLetter } from '../../../utils/utils';
import Button from '../buttons/Button';
import DurationButton from '../buttons/duration/DurationButton';
import CardInformation from '../card/CardInformation';
import { getCardGradient } from '../card/CardUtils';
import PokemonCard from '../card/PokemonCard';
import ErrorMessageBox from '../error/ErrorMessageBox';
import TableCardDetail from '../table/TableCardDetail';



const AuctionCardDetail = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    const { id } = useParams();
    const [card, setCard] = useState<CardType | null>(null);
    const [duration, setDuration] = useState<number>(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const [error, setError] = useState<string | null>(null);
    const [canBid, setCanBid] = useState<boolean>(false);
    const [inAuction, setInAuction] = useState<boolean>(false);

    const handleOpenBid = () => navigate(`/bid/${id}`);


    const sessionUser = useSelector((state: RootState) => state.user);
    const username = sessionUser.username.toLowerCase();


    useEffect(() => {
        const timer = setTimeout(() => {
            setError('Error: The request is taking too long to load.');
        }, 10000); // 10 segundos

        getCardFromAuction(id)
            .then((data) => {
                clearTimeout(timer);
                setCard(data.item);
                setDuration(data.duration);

                setInAuction(false);
                setCanBid(false);

                if (data.status === CardStatus.OnAuction && data.username == username) {
                    setInAuction(true);
                    setCanBid(false);
                }
                if (data.status === CardStatus.OnAuction && data.username != username) {
                    setInAuction(true);
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



    const handleBack = () => navigate(-1);

    return (
        <Box sx={{ maxWidth: 1200, width: '100%', margin: 'auto', marginTop: 5, padding: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button startIcon={<ArrowBackIcon />}
                variant="contained"
                sx={{ alignSelf: 'flex-start', margin: '10px' }}
                buttonType="ghost"
                onClick={handleBack}
                label='Volver'
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography
                    variant="h2"
                    align="center"
                    fontFamily={'Pokemon'}
                    mb={2}
                    sx={{
                        color: theme.palette.text.primary,
                        letterSpacing: 2,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                    }}
                >
                    {capitalizeFirstLetter(card.name)}
                </Typography>
                <Box
                    sx={{
                        background: getCardGradient(card.rarity),
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        mb: 2,
                    }}
                >
                </Box>
                <Grid container spacing={2} justifyContent="center" alignItems="stretch">
                    <Grid item xs={12} md={6}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 2 }}>
                            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                <PokemonCard card={card} userCardId={id} canFlip={true} maxSize={true} />
                                <DurationButton duration={duration} />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 2 }}>
                            <CardInformation card={card} id={id} />
                            {inAuction && canBid && <CardActions>
                                <Button
                                    startIcon={<AddCircleOutlineIcon />}
                                    variant="contained"
                                    sx={{ marginTop: 2, marginBottom: 2 }}
                                    fullWidth
                                    buttonType="primary"
                                    onClick={handleOpenBid}
                                    label='Realizar puja'
                                />
                            </CardActions>
                            } {inAuction && !canBid && <CardActions>

                                <Button
                                    startIcon={<RemoveCircleOutlineIcon />}
                                    variant="contained"
                                    sx={{ marginTop: 2, marginBottom: 2 }}
                                    fullWidth
                                    buttonType="ghost"
                                    label='Retirar subasta'
                                />
                            </CardActions>
                            }
                        </Card>
                    </Grid>
                </Grid>
                <TableCardDetail data={transactions} />
            </Box>
        </Box>
    );
};

export default AuctionCardDetail;
