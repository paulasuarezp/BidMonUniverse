import { Grid, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { getAuctionCards } from '../../../../api/api';
import { getActiveAuctions } from '../../../../api/auctionsAPI';
import { Auction, Card, UserCard } from '../../../../shared/sharedTypes';
import AuctionCard from '../../auction/AuctionCard';

interface ResponsiveActiveAuctionsGridProps {
    username: string;
    limit?: boolean;
}


const ResponsiveActiveAuctionsGrid = ({ username, limit = true }: ResponsiveActiveAuctionsGridProps) => {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down('xs'));
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const isMd = useMediaQuery(theme.breakpoints.down('md'));
    const isLg = useMediaQuery(theme.breakpoints.down('lg'));

    const [cards, setCards] = useState<UserCard[]>([]);
    const [numberOfCards, setNumberOfCards] = useState<number>(0);
    const [auctions, setAuctions] = useState<Auction[]>([]);

    const getGridListCols = () => {
        if (isXs) return 1; // En teléfonos móviles, mostrar una sola columna
        if (isSm) return 2; // En tablets pequeñas, mostrar dos columnas
        if (isMd) return 3; // En tablets grandes, mostrar tres columnas
        if (isLg) return 4; // En pantallas pequeñas de escritorio, mostrar cuatro columnas
        return 6; // En pantallas grandes, mostrar seis columnas
    };

    function millisecondsToHours(milliseconds: number) {
        let hours = milliseconds / 1000 / 60 / 60;
        return Math.round(hours);
    }

    function calculateRemainingTime(date: Date) {
        const now = new Date();
        const endDate = new Date(date);
        const diff = endDate.getTime() - now.getTime();
        return millisecondsToHours(diff);
    }


    useEffect(() => {
        getActiveAuctions(username)
            .then((data) => {
                setAuctions(data);
                getAuctionCards(data).then((cards) => {
                    setCards(cards);
                    console.log('Cartas del usuario', cards);
                    if (limit) {
                        // Si hay límite, ajusta el número de cartas basado en el tamaño de la pantalla.
                        const initialCount = getGridListCols();
                        setNumberOfCards(Math.min(cards.length, initialCount));
                    } else {
                        // Si no hay límite, usa todas las cartas.
                        setNumberOfCards(cards.length);
                    }
                }).catch((error) => {
                    console.error('Error al obtener las cartas del usuario', error);
                });
            })
            .catch((error) => {
                console.error('Error al obtener las cartas del usuario', error);
            });
    }, []);


    return (
        <Grid container spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
            direction="row"
            justifyContent="center"
            alignItems="center"
            style={{ padding: '1em', marginBottom: '2em' }}
        >
            {Array.from({ length: numberOfCards }, (_, index) => (
                <Grid item key={index} style={{ flex: '0 0 auto' }}>
                    <AuctionCard
                        card={cards[index].item as Card}
                        userCardId={cards[index]._id}
                        duration={calculateRemainingTime(auctions[index].estimatedEndDate)}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default ResponsiveActiveAuctionsGrid;