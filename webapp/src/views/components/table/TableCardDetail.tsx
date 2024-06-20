import {
    Paper,
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow,
    useTheme
} from "@mui/material";
import { TransactionConcept } from "../../../shared/sharedTypes";
import { getTransactionMessage } from '../../../utils/utils';

interface TableCardDetailProps {
    data: any[];
}

export default function TableCardDetail({ data }: TableCardDetailProps) {
    const theme = useTheme();

    return (
        <TableContainer component={Paper} sx={{ width: '100%', marginTop: 2 }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell colSpan={3} align="center" style={{ fontWeight: 'bold', color: theme.palette.mode === 'dark' ? theme.palette.primary.contrastText : '#000000', borderBottom: `3px solid ${theme.palette.primary.main}` }}>
                            Historial de transacciones de la carta
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell width="30%" style={{ fontWeight: 'bold', borderBottom: `1px solid ${theme.palette.primary.light}` }}>Fecha</TableCell>
                        <TableCell width="40%" style={{ fontWeight: 'bold', borderBottom: `1px solid ${theme.palette.primary.light}` }}>Concepto</TableCell>
                        <TableCell width="30%" style={{ fontWeight: 'bold', borderBottom: `1px solid ${theme.palette.primary.light}` }}>Precio</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((transaction, index) => (
                        <TableRow
                            key={transaction._id}
                            sx={{
                                backgroundColor: index % 2 ? theme.palette.action.hover : 'transparent',
                                '&:hover': {
                                    backgroundColor: theme.palette.action.selected,
                                }
                            }}
                        >
                            <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                            <TableCell>{getTransactionMessage(TransactionConcept[transaction.concept])}</TableCell>
                            <TableCell>
                                <span style={{ verticalAlign: 'middle' }}>{transaction.price}</span>
                                <img src="/zen.png" alt="Zen" style={{ width: 20, height: 20, marginLeft: 5, verticalAlign: 'middle' }} />
                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}