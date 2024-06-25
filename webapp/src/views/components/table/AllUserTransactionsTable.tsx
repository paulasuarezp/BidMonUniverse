import { Box, CircularProgress, useTheme } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Transaction } from '../../../shared/sharedTypes';
import ErrorMessageBox from '../MessagesBox/ErrorMessageBox';

interface UserTransactionsTableProps {
    data: Transaction[];
}

const columns: GridColDef[] = [
    { field: 'username', headerName: 'Usuario', flex: 2 },
    {
        field: 'date',
        headerName: 'Fecha',
        flex: 2,
        renderCell: ({ value }) => <span>{new Date(value).toLocaleDateString()}</span>,
    },
    {
        field: 'mensajeConcepto',
        headerName: 'Concepto',
        flex: 5,
        renderCell: ({ value }) => (
            <div style={{ whiteSpace: 'normal' }}>
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
                <img src="/zen.png" alt="Zen" style={{ width: 20, height: 20, marginLeft: 5 }} />
            </div>
        ),
    },
];

export default function AllUserTransactionsTable({ data }: UserTransactionsTableProps) {
    const theme = useTheme();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!data || data.length === 0) {
        return <ErrorMessageBox message="No se han encontrado transacciones" />;
    }

    return (
        <div style={{ height: 'auto', width: '100%', borderRadius: 8 }}>
            <DataGrid
                rows={data}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10, 20]}
                checkboxSelection
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
                    },
                }}
            />
        </div>
    );
}
