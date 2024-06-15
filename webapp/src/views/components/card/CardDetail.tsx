import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from "@mui/material";
import { Card as CardType } from "../../../shared/sharedTypes";
import { getUserCard } from '../../../api/userCardsAPI';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import PokemonCard from './PokemonCard';

const CardDetail = () => {
    const sessionUser = useSelector((state: RootState) => state.user);
    const { id } = useParams<{ id: string }>();
    const [card, setCard] = useState<CardType | null>(null);
    const [userCard, setUserCard] = useState(null);

    const username = sessionUser.username;

    useEffect(() => {
        getUserCard(username, id)
            .then((data) => {
                setCard(data.card);
                setUserCard(data.userCard);
                console.log('Data', data);
            })
            .catch((error) => {
                console.error('Error al obtener la carta del usuario', error);
            });
    }, [id, username]);

    if (!card) {
        return <Typography>Cargando...</Typography>;
    }

    return (
        <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
            <PokemonCard card={card} canFlip={true} />
        </Box>
    );
};

export default CardDetail;
