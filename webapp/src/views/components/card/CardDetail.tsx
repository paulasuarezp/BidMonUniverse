import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Grid, Button, CircularProgress, IconButton, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import GavelIcon from '@mui/icons-material/Gavel'; // Importa el ícono de martillo (Gavel)
import { Card as CardType, TransactionConcept } from "../../../shared/sharedTypes";
import { getUserCard } from '../../../api/userCardsAPI';
import { getTransactionsForCard } from '../../../api/transactionsAPI';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import PokemonCard from './PokemonCard';
import AddAuctionForm from '../modals/AddAuctionForm';

const CardDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [card, setCard] = useState<CardType | null>(null);
    const [transactions, setTransactions] = useState([]);
    const [openModal, setOpenModal] = useState(false);

    const handleOpen = () => setOpenModal(true);
    const handleClose = () => setOpenModal(false);

    const sessionUser = useSelector((state: RootState) => state.user);
    const username = sessionUser.username;

    useEffect(() => {
        getUserCard(username, id).then((data) => {
            setCard(data.card);
            getTransactionsForCard(username, id).then(setTransactions).catch(console.error);
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
            <IconButton onClick={handleBack} sx={{ alignSelf: 'flex-start', margin: '10px' }}>
                <ArrowBackIcon />
                Volver
            </IconButton>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="h4" align="center" fontFamily={'Pokemon'} gutterBottom>{card.name}</Typography>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <PokemonCard card={card} canFlip={true} maxSize={true} />
                            <Button startIcon={<StarIcon />} variant="outlined" sx={{ color: 'gold', borderColor: 'gold', '&:hover': { color: 'white', backgroundColor: 'gold', borderColor: 'gold' } }}>
                                Destacar carta
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" gutterBottom>Detalles de la carta</Typography>
                        <Typography><strong>Nombre:</strong> {card.name}</Typography>
                        <Typography><strong>Rareza:</strong> {card.rarity}</Typography>
                        <Typography><strong>Tipo:</strong> {card.pokemonType}</Typography>

                        <Button
                            startIcon={<GavelIcon />}
                            variant="contained"
                            sx={{ marginTop: 2, marginBottom: 2, backgroundColor: 'gray', '&:hover': { backgroundColor: '#404040' } }}
                            fullWidth
                            onClick={handleOpen}
                        >
                            Realizar subasta
                        </Button>
                        <AddAuctionForm open={openModal} handleClose={handleClose} />

                        <TableContainer component={Paper} sx={{ width: '100%' }}>
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
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};



export default CardDetail;
