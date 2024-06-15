import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Grid, Button, CircularProgress, IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import { Card as CardType, TransactionConcept } from "../../../shared/sharedTypes";
import { getUserCard } from '../../../api/userCardsAPI';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import PokemonCard from './PokemonCard';
import { getTransactionsForCard } from '../../../api/transactionsAPI';

const CardDetail = () => {
    const navigate = useNavigate();
    const sessionUser = useSelector((state: RootState) => state.user);
    const { id } = useParams<{ id: string }>();
    const [card, setCard] = useState<CardType | null>(null);
    const [userCard, setUserCard] = useState(null);
    const [transactions, setTransactions] = useState([]);

    const username = sessionUser.username;

    useEffect(() => {
        getUserCard(username, id)
            .then((data) => {
                setCard(data.card);
                setUserCard(data.userCard);
                console.log('Card Data', data);
                getTransactionsForCard(username, id).then((data) => {
                    console.log('Transactions data', data);
                    setTransactions(data);
                }).catch((error) => {
                    console.error('Error al obtener las transacciones de la carta', error);
                });
            })
            .catch((error) => {
                console.error('Error al obtener la carta del usuario', error);
            });
    }, [id, username]);

    if (!card) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    const handleBack = () => {
        navigate('/album');
    };
    return (
        <Box sx={{ maxWidth: 1200, margin: '1.2em', padding: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <IconButton onClick={handleBack} sx={{ alignSelf: 'flex-start' }}>
                <ArrowBackIcon />
                Volver
            </IconButton>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <PokemonCard card={card} canFlip={true} maxSize={true} />
                        <Button
                            startIcon={<StarIcon />}
                            variant="outlined"
                            sx={{
                                color: 'gold',
                                borderColor: 'gold',
                                '&:hover': {
                                    color: 'white',
                                    backgroundColor: 'gold',
                                    borderColor: 'gold'
                                }
                            }}
                        >
                            Destacar carta
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h5" gutterBottom>Información de la Carta</Typography>
                    <Typography><strong>Nombre:</strong> {card.name}</Typography>
                    <Typography><strong>Rareza:</strong> {card.rarity}</Typography>
                    <Typography><strong>Tipo:</strong> {card.pokemonType}</Typography>
                    <TableContainer component={Paper} sx={{ width: '100%' }}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
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
                                        <TableCell>{TransactionConcept[transaction.concept[0]]}</TableCell>
                                        <TableCell >{transaction.price}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                </Grid>
            </Grid>
        </Box>
    );
};


export default CardDetail;
