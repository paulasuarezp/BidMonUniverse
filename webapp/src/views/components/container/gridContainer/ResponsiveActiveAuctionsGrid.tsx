import { CircularProgress, Grid, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { filterAuctionsByUserActiveBid, getAuctionCards } from '../../../../api/api';
import { getActiveAuctions, getAuctions, getUserActiveAuctions } from '../../../../api/auctionsAPI';
import { Auction, Card, UserCard } from '../../../../shared/sharedTypes';
import ErrorMessageBox from '../../MessagesBox/ErrorMessageBox';
import InfoMessageBox from '../../MessagesBox/InfoMessageBox';
import AuctionCard from '../../cardDetail/auction/AuctionCard';

interface ResponsiveActiveAuctionsGridProps {
    username: string;
    limit?: boolean;
    showUserAuctions?: boolean;
    isAdmin?: boolean;
}

const ResponsiveActiveAuctionsGrid = ({ username, isAdmin = false, limit = true, showUserAuctions = false }: ResponsiveActiveAuctionsGridProps) => {
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

    const getGridListCols = () => {
        if (isXs) return 1;
        if (isSm) return 2;
        if (isMd) return 3;
        if (isLg) return 4;
        return 6;
    };

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
            setError('Error al obtener los datos de las subastas');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData(showUserAuctions);
    }, [showUserAuctions]);

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

export default ResponsiveActiveAuctionsGrid;
