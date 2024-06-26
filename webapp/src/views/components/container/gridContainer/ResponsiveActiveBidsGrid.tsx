import { CircularProgress, Grid, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { getBidsCards } from '../../../../api/api';
import { getUserActiveBids } from '../../../../api/bidsAPI';
import { Bid, Card, UserCard } from '../../../../shared/sharedTypes';
import BidCard from '../../cardDetail/bid/BidCard';
import ErrorMessageBox from '../../messagesBox/ErrorMessageBox';
import InfoMessageBox from '../../messagesBox/InfoMessageBox';

interface ResponsiveActiveAuctionsGridProps {
    username: string;
    limit?: boolean;
}

const ResponsiveActiveBidsGrid = ({ username, limit = false }: ResponsiveActiveAuctionsGridProps) => {
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

    const getGridListCols = () => {
        if (isXs) return 1;
        if (isSm) return 2;
        if (isMd) return 3;
        if (isLg) return 4;
        return 6;
    };

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
            setError('Error al obtener los datos de las subastas');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <ErrorMessageBox />;
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
            {numberOfCards === 0 && <InfoMessageBox message="¡Es un buen momento para relajarte y planear tu próxima estrategia de puja!" />}
        </Grid>
    );
};

export default ResponsiveActiveBidsGrid;
