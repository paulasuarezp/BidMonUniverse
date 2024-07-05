import CloseIcon from '@mui/icons-material/Close';
import { Alert, Box, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Transaction } from '../../../shared/sharedTypes';
import Container from '../container/Container';

// #region PROPS UserTransactionsTableProps
interface UserTransactionsTableProps {
    data: Transaction[];
}
// #endregion

/**
 * Definición de las columnas de la tabla
 */
const columns: GridColDef[] = [
    {
        field: 'date',
        headerName: 'Fecha',
        flex: 1.5,
        renderCell: ({ value }) => <span>{new Date(value).toLocaleString()}</span>,
    },
    {
        field: 'userCard',
        headerName: 'ID de la carta',
        flex: 2,
    },
    {
        field: 'mensajeConcepto',
        headerName: 'Concepto',
        flex: 5,
        renderCell: ({ value }) => (
            <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {value}
            </div>
        ),
    },
    {
        field: 'price',
        headerName: 'Precio',
        flex: 1,
        renderCell: ({ value }) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span>{value}</span>
                <img src="/zen.png" alt="Icono de Zen" style={{ width: 20, height: 20, marginLeft: 5 }} />
            </div>
        ),
    },
];

// #region COMPONENTE UserTransactionsTable
// Componente que muestra una tabla con las transacciones de un usuario
export default function UserTransactionsTable({ data }: UserTransactionsTableProps) {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down('xs'));
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [cellContent, setCellContent] = useState<Partial<Transaction> | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    /**
     * Función que se ejecuta al hacer clic en una celda de la tabla 
     * y muestra el contenido de la celda en un diálogo
     * @param params 
     * @returns 
     */
    const handleCellClick = (params: any) => {
        if (!isXs && !isSm) return;

        const transaction = data.find((row) => row._id === params.id);

        if (transaction) {
            setCellContent(transaction);
            setOpen(true);
        }
    };

    /**
     * Función para cerrar el diálogo
     */
    const handleClose = () => {
        setOpen(false);
        setCellContent(null);
    };

    // LOADING
    if (loading) {
        return <Container style={{ textAlign: 'center' }}><CircularProgress aria-label="Cargando transacciones" /></Container>;
    }

    // ALERTA SI NO DATA
    if (!data || data.length === 0) {
        return <Alert severity="info" role="alert">No tienes transacciones</Alert>;
    }

    return (
        <div style={{ height: 'auto', width: '100%', borderRadius: 8 }}>
            <DataGrid
                rows={data}
                columns={columns}
                onCellClick={handleCellClick}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10, 20]}
                getRowId={(row) => row._id}
                autoHeight
                sx={{
                    boxShadow: 2,
                    border: 2,
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.mode === 'dark' ? theme.palette.primary.contrastText : '#000000',
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: theme.palette.primary.main,
                        fontWeight: 'bold',
                        borderBottom: `3px solid ${theme.palette.primary.main}`,
                    },
                    '& .MuiDataGrid-cell': {
                        '&:hover': {
                            backgroundColor: theme.palette.action.selected,
                        },
                        padding: '10px',
                        borderBottom: `1px solid ${theme.palette.divider}`,
                    },
                    '& .MuiDataGrid-row': {
                        '&:nth-of-type(even)': {
                            backgroundColor: theme.palette.action.hover,
                        },
                        '& .MuiDataGrid-cell': {
                            borderBottom: 'none',
                        },
                    }
                }}
            />
            <Dialog open={open} onClose={handleClose} fullWidth aria-labelledby="transaction-dialog-title">
                <DialogTitle id="transaction-dialog-title">
                    Detalles de la transacción
                    <IconButton
                        aria-label="Cerrar"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {cellContent && (
                        <Box sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                            <Typography variant="body1"><strong>Fecha:</strong> {new Date(cellContent.date).toLocaleString()}</Typography>
                            <Typography variant="body1"><strong>ID de la carta:</strong> {cellContent.userCard}</Typography>
                            <Typography variant="body1"><strong>Concepto:</strong> {cellContent.concept}</Typography>
                            <Typography variant="body1"><strong>Precio:</strong> {cellContent.price} Zen</Typography>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
// #endregion
