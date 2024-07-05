import { Box, CircularProgress, Grid, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { getBidsCards } from '../../../../api/api';
import { getUserActiveBids } from '../../../../api/bidsAPI';
import { Bid, Card, UserCard } from '../../../../shared/sharedTypes';
import BidCard from '../../card/bid/BidCard';
import ErrorMessageBox from '../../messages/ErrorMessageBox';
import InfoMessageBox from '../../messages/InfoMessageBox';

// #region PROPS
interface ResponsiveActiveAuctionsGridProps {
    username: string;
    limit?: boolean;
}
// #endregion

// #region COMPONENT ResponsiveActiveAuctionsGrid
/**
 * Grid de subastas activas responsive
 * @param username - Nombre de usuario
 * @param limit - Límite de cartas a mostrar
 */
export default function ResponsiveActiveBidsGrid({ username, limit = false }: ResponsiveActiveAuctionsGridProps) {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down('xs'));
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const isMd = useMediaQuery(theme.breakpoints.down('md'));
    const isLg = useMediaQuery(theme.breakpoints.down('lg'));

    const [cards, setCards] = useState<UserCard[]>([]);
    const [numberOfCards, setNumberOfCards] = useState<number>(0);
    const [bids, setBids] = useState<Bid[]>([]);
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
     * Función para obtener los datos de las subastas y las cartas
     */
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getUserActiveBids(username);
            setBids(data);
            const cardsData = await getBidsCards(data);
            setCards(cardsData);
            const numberOfCards = limit ? Math.min(cardsData.length, getGridListCols()) : cardsData.length;
            setNumberOfCards(numberOfCards);
        } catch (err) {
            setError('Se ha producido un error al obtener los datos de las pujas activas.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);


    // LOADING
    if (loading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', }}><CircularProgress /> </Box>
        );
    }

    // ERROR
    if (error) {
        return <ErrorMessageBox message={error} />;
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
                    <BidCard
                        card={cards[index].item as Card}
                        userCardId={cards[index]._id}
                        duration={cards[index].duration}
                        bidId={bids[index]._id}
                        price={bids[index].price}
                    />
                </Grid>
            ))}
            {numberOfCards === 0 && <InfoMessageBox seccion='pujas' message="¡Es un buen momento para relajarte y planear tu próxima estrategia de puja!" />}
        </Grid>
    );
};
// #endregion