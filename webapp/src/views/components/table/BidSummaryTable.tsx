import {
    CircularProgress,
    Paper,
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow,
    useTheme
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getBidsCards } from "../../../api/api";
import { getUserActiveBids } from "../../../api/bidsAPI";
import { RootState } from "../../../redux/store";
import { Bid, UserCard } from "../../../shared/sharedTypes";
import Container from "../container/Container";


export default function BidSummaryTable() {
    const theme = useTheme();

    const sessionUser = useSelector((state: RootState) => state.user);
    const username = sessionUser.username;

    const [cards, setCards] = useState<UserCard[]>([]);
    const [numberOfCards, setNumberOfCards] = useState<number>(0);
    const [bids, setBids] = useState<Bid[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getUserActiveBids(username);
            setBids(data);
            const cardsData = await getBidsCards(data);
            setCards(cardsData);
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
        return <Container style={{ textAlign: 'center' }}><CircularProgress /></Container>;
    }

    return (
        <TableContainer component={Paper} sx={{ width: '100%', marginTop: 2 }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell colSpan={3} align="center" style={{ fontWeight: 'bold', color: theme.palette.mode === 'dark' ? theme.palette.primary.contrastText : '#000000', borderBottom: `3px solid ${theme.palette.primary.main}` }}>
                            Resumen de pujas activas
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell width="40%" style={{ fontWeight: 'bold', borderBottom: `1px solid ${theme.palette.primary.light}` }}>Nombre de la carta</TableCell>
                        <TableCell width="30%" style={{ fontWeight: 'bold', borderBottom: `1px solid ${theme.palette.primary.light}` }}>Cantidad de la puja:</TableCell>
                        <TableCell width="30%" style={{ fontWeight: 'bold', borderBottom: `1px solid ${theme.palette.primary.light}` }}>Duración restante:</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {cards.map((card, index) => (
                        <TableRow
                            key={card._id}
                            sx={{
                                backgroundColor: index % 2 ? theme.palette.action.hover : 'transparent',
                                '&:hover': {
                                    backgroundColor: theme.palette.action.selected,
                                }
                            }}
                        >
                            <TableCell>{card.item.name}</TableCell>
                            <TableCell>
                                <span style={{ verticalAlign: 'middle' }}>{card.initialPrice}</span>
                                <img src="/zen.png" alt="Zen" style={{ width: 20, height: 20, marginLeft: 5, verticalAlign: 'middle' }} />
                            </TableCell>
                            <TableCell>{card.duration} horas</TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}