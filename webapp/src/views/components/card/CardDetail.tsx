import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Grid, CircularProgress, IconButton, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Card, CardContent, CardActions, useTheme
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import GavelIcon from '@mui/icons-material/Gavel';
import HealthIcon from '@mui/icons-material/Favorite';
import AttackIcon from '@mui/icons-material/FlashOn';
import DefenseIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import WeightIcon from '@mui/icons-material/FitnessCenter';
import HeightIcon from '@mui/icons-material/Height';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import QuantityIcon from '@mui/icons-material/Inbox';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { CardRarity, Card as CardType, PokemonGym, TransactionConcept } from "../../../shared/sharedTypes";
import { getUserCard } from '../../../api/userCardsAPI';
import { getTransactionsForCard } from '../../../api/transactionsAPI';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import PokemonCard from './PokemonCard';
import AddAuctionForm from '../modals/AddAuctionForm';
import Button from '../buttons/Button';
import { capitalizeFirstLetter } from '../../../utils/utils';

function getCardGradient(rarity: CardRarity) {
    if (!rarity) return '';
    switch (rarity) {
        case CardRarity.Common:
            return 'linear-gradient(to top, #708090, #E0FFFF)'; // SlateGray to LightCyan
        case CardRarity.Rare:
            return 'linear-gradient(to top, #4169E1, #87CEFA)'; // RoyalBlue to LightSkyBlue
        case CardRarity.UltraRare:
            return 'linear-gradient(to top, #FFD700, #FFFACD)'; // Gold to LemonChiffon
        case CardRarity.Legendary:
            return 'linear-gradient(to top, #8A2BE2, #DDA0DD)'; // BlueViolet to Plum
        case CardRarity.Mythical:
            return 'linear-gradient(to top, #DC143C, #FFB6C1)'; // Crimson to LightPink
        default:
            return '';
    }
}

function getPokemonGymImg(pokemonGym: PokemonGym) {
    switch (pokemonGym) {
        case PokemonGym.Saffron:
            return '/gymBadges/saffron_marsh.png';
        case PokemonGym.Pewter:
            return '/gymBadges/pewter_boulder.png';
        case PokemonGym.Cerulean:
            return '/gymBadges/cerulean_cascade.png';
        case PokemonGym.Vermilion:
            return '/gymBadges/vermilion_thunder.png';
        case PokemonGym.Celadon:
            return '/gymBadges/celadon_rainbow.png';
        case PokemonGym.Fuchsia:
            return '/gymBadges/fuchsia_soul.png';
        case PokemonGym.Cinnabar:
            return '/gymBadges/cinnabar_volcano.png';
        case PokemonGym.Viridian:
            return '/gymBadges/viridian_earth.png';
        default:
            return '';
    }
}

const CardDetail = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    const { id } = useParams();
    const [card, setCard] = useState<CardType | null>(null);
    const [transactions, setTransactions] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [descriptions, setDescriptions] = useState([]);
    const [hasGym, setHasGym] = useState(false);

    const handleOpen = () => setOpenModal(true);
    const handleClose = () => setOpenModal(false);


    const sessionUser = useSelector((state: RootState) => state.user);
    const username = sessionUser.username;

    useEffect(() => {
        getUserCard(username, id).then((data) => {
            setCard(data.card);
            getTransactionsForCard(username, id).then(setTransactions).catch(console.error);
            let descrs = data.card.description[0].split('@NEWDESCRIPTION@');
            setDescriptions(descrs);
            if (data.card.gym && data.card.gym[0] !== 'none') {
                setHasGym(true);
            }
        }).catch(console.error);
    }, [id, username]);

    if (!card) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
        </Box>;
    }

    const handleBack = () => navigate('/album');

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
                                <PokemonCard card={card} canFlip={true} maxSize={true} />
                                <Button startIcon={<StarIcon />}
                                    variant="contained"
                                    sx={{ marginTop: 2, marginBottom: 2 }}
                                    buttonType="ghost"
                                    onClick={handleOpen}
                                    label='Destacar carta'
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 2 }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h5" gutterBottom>Detalles de la carta</Typography>
                                <Box display="flex" alignItems="center"><HealthIcon sx={{ mr: 1, color: '#e91e63' }} /><Typography><strong>HP:</strong> {card.hp}</Typography></Box>
                                <Box display="flex" alignItems="center"><AttackIcon sx={{ mr: 1, color: '#ff9800' }} /><Typography><strong>Ataque:</strong> {card.attack}</Typography></Box>
                                <Box display="flex" alignItems="center"><DefenseIcon sx={{ mr: 1, color: '#3f51b5' }} /><Typography><strong>Defensa:</strong> {card.defense}</Typography></Box>
                                <Box display="flex" alignItems="center"><SpeedIcon sx={{ mr: 1, color: '#4caf50' }} /><Typography><strong>Velocidad:</strong> {card.speed}</Typography></Box>
                                <Box display="flex" alignItems="center"><WeightIcon sx={{ mr: 1, color: '#9c27b0' }} /><Typography><strong>Peso:</strong> {card.weight}</Typography></Box>
                                <Box display="flex" alignItems="center"><HeightIcon sx={{ mr: 1, color: '#00bcd4' }} /><Typography><strong>Altura:</strong> {card.height}</Typography></Box>
                                <Box display="flex" alignItems="center"><CalendarTodayIcon sx={{ mr: 1, color: '#795548' }} /><Typography><strong>Fecha de lanzamiento:</strong> {new Date(card.releaseDate).toLocaleDateString()}</Typography></Box>
                                <Box display="flex" alignItems="center"><QuantityIcon sx={{ mr: 1, color: '#ff5722' }} /><Typography><strong>Cantidad disponible:</strong> {card.availableQuantity}</Typography></Box>
                                {card.is_legendary && <Typography><strong>¡Es un Pokémon legendario!</strong></Typography>}
                                {card.is_mythical && <Typography><strong>¡Es un Pokémon mítico!</strong></Typography>}
                                {hasGym && <Typography><strong>Gimnasio:</strong> {card.gym.map((gym) => <img key={gym} src={getPokemonGymImg(gym)} alt={gym} style={{ width: 50, height: 50, margin: 5 }} />)}</Typography>}

                                <Typography align="center" gutterBottom sx={{ mt: 4 }}>
                                    <AutoAwesomeIcon sx={{ mr: 1 }} style={{ color: '#FFD700' }} />
                                    {descriptions[0]}
                                    <AutoAwesomeIcon sx={{ ml: 1 }} style={{ color: '#FFD700' }} />
                                </Typography>

                            </CardContent>
                            <CardActions>
                                <Button
                                    startIcon={<GavelIcon />}
                                    variant="contained"
                                    sx={{ marginTop: 2, marginBottom: 2 }}
                                    fullWidth
                                    buttonType="primary"
                                    onClick={handleOpen}
                                    label='Realizar subasta'
                                />
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>
                <TableContainer component={Paper} sx={{ width: '100%', marginTop: 2 }}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={3} align="center" style={{ fontWeight: 'bold' }}>Historial de transacciones de la carta</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell width="30%">Fecha</TableCell>
                                <TableCell width="40%">Concepto</TableCell>
                                <TableCell width="30%">Precio</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions.map((transaction) => (
                                <TableRow key={transaction._id}>
                                    <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{TransactionConcept[transaction.concept]}</TableCell>
                                    <TableCell>{transaction.price}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default CardDetail;
