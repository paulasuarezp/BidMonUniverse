import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Grid, CircularProgress, IconButton, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Card, CardContent, CardActions
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import GavelIcon from '@mui/icons-material/Gavel';
import { Card as CardType, PokemonGym, TransactionConcept } from "../../../shared/sharedTypes";
import { getUserCard } from '../../../api/userCardsAPI';
import { getTransactionsForCard } from '../../../api/transactionsAPI';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import PokemonCard from './PokemonCard';
import AddAuctionForm from '../modals/AddAuctionForm';
import Button from '../buttons/Button';

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
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="h4" align="center" fontFamily={'Pokemon'} gutterBottom>{card.name}</Typography>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} md={6}>
                        <Card sx={{ width: '100%', padding: 2 }}>
                            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                <PokemonCard card={card} canFlip={true} maxSize={true} />
                                <Button startIcon={<StarIcon />}
                                    variant="contained"
                                    sx={{ marginTop: 2, marginBottom: 2 }}
                                    buttonType="ghost"
                                    onClick={handleOpen}
                                    label='Realizar subasta'
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ width: '100%', padding: 2 }}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>Detalles de la carta</Typography>
                                <Typography><strong>Nombre:</strong> {card.name}</Typography>
                                <Typography><strong>Rareza:</strong> {card.rarity}</Typography>
                                <Typography><strong>Tipo:</strong> {card.pokemonType}</Typography>
                                <Typography><strong>HP:</strong> {card.hp}</Typography>
                                <Typography><strong>Ataque:</strong> {card.attack}</Typography>
                                <Typography><strong>Defensa:</strong> {card.defense}</Typography>
                                <Typography><strong>Velocidad:</strong> {card.speed}</Typography>
                                <Typography><strong>Peso:</strong> {card.weight}</Typography>
                                <Typography><strong>Altura:</strong> {card.height}</Typography>
                                <Typography><strong>Fecha de lanzamiento:</strong> {new Date(card.releaseDate).toLocaleDateString()}</Typography>
                                <Typography><strong>Cantidad disponible:</strong> {card.availableQuantity}</Typography>
                                <Typography><strong>Descripción:</strong> {descriptions[0]}</Typography>
                                {card.is_legendary && <Typography><strong>¡Es un Pokémon legendario!</strong></Typography>}
                                {card.is_mythical && <Typography><strong>¡Es un Pokémon mítico!</strong></Typography>}
                                {hasGym && <Typography><strong>Gimnasio:</strong> {card.gym.map((gym) => <img key={gym} src={getPokemonGymImg(gym)} alt={gym} style={{ width: 50, height: 50, margin: 5 }} />)}</Typography>}
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
