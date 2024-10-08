import { Box, CircularProgress, Grid, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { filterAuctionsByUserActiveBid, getAuctionCards } from '../../../../api/api';
import { getActiveAuctions, getAuctions, getUserActiveAuctions } from '../../../../api/auctionsAPI';
import { Auction, Card, UserCard } from '../../../../shared/sharedTypes';
import AuctionCard from '../../card/auction/AuctionCard';
import ErrorMessageBox from '../../messages/ErrorMessageBox';
import InfoMessageBox from '../../messages/InfoMessageBox';

// #region PROPS
interface ResponsiveActiveAuctionsGridProps {
    username: string;
    limit?: boolean;
    showUserAuctions?: boolean;
    isAdmin?: boolean;
}
// #endregion

// #region COMPONENT ResponsiveActiveAuctionsGrid
/**
 * Grid de subastas activas responsive
 * @param username - Nombre de usuario
 * @param limit - Límite de cartas a mostrar
 * @param showUserAuctions - Indica si se deben mostrar las subastas activas del usuario
 * @param isAdmin - Indica si el usuario es administrador
 */
export default function ResponsiveActiveAuctionsGrid({ username, isAdmin = false, limit = true, showUserAuctions = false }: ResponsiveActiveAuctionsGridProps) {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down('xs'));
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const isMd = useMediaQuery(theme.breakpoints.down('md'));
    const isLg = useMediaQuery(theme.breakpoints.down('lg'));

    const [cards, setCards] = useState<UserCard[]>([]);
    const [numberOfCards, setNumberOfCards] = useState<number>(0);
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Función para obtener el número de columnas en función del tamaño de la pantalla
     * @returns Número de columnas
     */
    const getGridListCols = () => {
        if (isXs) return 1;
        if (isSm) return 2;
        if (isMd) return 3;
        if (isLg) return 4;
        return 6;
    };

    /**
     * Función para obtener los datos de las subastas, filtrarlas y obtener las cartas.
     * Si el usuario es administrador, se obtienen todas las subastas activas.
     * @param isUserAuctions - Indica si se deben obtener las subastas activas del usuario
     */
    const fetchData = async (isUserAuctions: boolean) => {
        setLoading(true);
        setError(null);
        try {
            let auctionData;
            let filteredAuctions;
            if (isAdmin) {
                filteredAuctions = await getAuctions();
            } else {
                auctionData = isUserAuctions ? await getUserActiveAuctions(username) : await getActiveAuctions(username);
                filteredAuctions = await filterAuctionsByUserActiveBid(auctionData, username);
            }
            setAuctions(filteredAuctions);
            const cardsData = await getAuctionCards(filteredAuctions);
            setCards(cardsData);
            const numberOfCards = limit ? Math.min(cardsData.length, getGridListCols()) : cardsData.length;
            setNumberOfCards(numberOfCards);
        } catch (err) {
            setError('Se ha producido un error al obtener los datos de las subastas activas.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData(showUserAuctions);
    }, [showUserAuctions]);

    // LOADING
    if (loading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', }}><CircularProgress /> </Box>
        );
    }


    // ERROR
    if (error) {
        return (<ErrorMessageBox message='Se ha prududico un error al obtener los datos de las subastas.' />);
    }

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
                        duration={cards[index].duration}
                        auctionId={auctions[index]._id}
                    />
                </Grid>
            ))}
            {numberOfCards === 0 && <InfoMessageBox />}
        </Grid>
    );
};
// #endregion