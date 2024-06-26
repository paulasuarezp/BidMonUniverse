import {
    Alert,
    CircularProgress,
    Paper,
    Table, TableBody, TableCell,
    TableContainer, TableHead,
    TablePagination,
    TableRow,
    useTheme
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getBidsCards } from "../../../api/api";
import { getUserActiveBids } from "../../../api/bidsAPI";
import { RootState } from "../../../redux/store";
import { UserCard } from "../../../shared/sharedTypes";
import Container from "../container/Container";

// #region COMPONENTE BidSummaryTable
export default function BidSummaryTable() {
    const theme = useTheme();

    const sessionUser = useSelector((state: RootState) => state.user);
    const username = sessionUser.username;

    const [cards, setCards] = useState<UserCard[]>([]);
    const [numberOfCards, setNumberOfCards] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    /**
     * Función para obtener los datos de las pujas activas del usuario
     */
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getUserActiveBids(username);
            const cardsData = await getBidsCards(data);
            setCards(cardsData);
            setNumberOfCards(cardsData.length);
        } catch (err) {
            setError('Actualmente no se han podido cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    /**
     * Función para cambiar de página
     * @param event - Evento
     * @param newPage - Nueva página
     */
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    /**
     * Función para cambiar el número de filas por página
     * @param event - Evento
     */
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // LOADING
    if (loading) {
        return (
            <Container style={{ textAlign: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    // ERROR
    if (error) {
        return (
            <Alert severity="error">No se han podido cargar los datos, por favor, inténtalo de nuevo más tarde</Alert>

        );
    }

    // ALERTA SI NO DATA
    if (cards && !cards.length) {
        return (
            <Alert severity="info">No tienes pujas activas</Alert>
        );
    }

    return (
        <Paper sx={{ width: '100%', marginTop: 2 }}>
            <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={3} align="center" style={{ fontWeight: 'bold', color: theme.palette.mode === 'dark' ? theme.palette.primary.contrastText : '#000000', borderBottom: `3px solid ${theme.palette.primary.main}` }}>
                                Resumen de pujas activas
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell width="40%" style={{ fontWeight: 'bold', borderBottom: `1px solid ${theme.palette.primary.light}` }}>Nombre de la carta</TableCell>
                            <TableCell width="30%" style={{ fontWeight: 'bold', borderBottom: `1px solid ${theme.palette.primary.light}` }}>Cantidad de la puja</TableCell>
                            <TableCell width="30%" style={{ fontWeight: 'bold', borderBottom: `1px solid ${theme.palette.primary.light}` }}>Duración restante</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cards.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((card, index) => (
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
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={numberOfCards}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Filas por página"
            />
        </Paper>
    );
}
// #endregion