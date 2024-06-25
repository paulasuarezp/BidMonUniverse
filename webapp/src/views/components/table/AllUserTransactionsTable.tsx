import { useTheme } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Transaction } from '../../../shared/sharedTypes';
import ErrorMessageBox from '../MessagesBox/ErrorMessageBox';

interface UserTransactionsTableProps {
    data: Transaction[];
}

const columns: GridColDef[] = [
    { field: 'username', headerName: 'Usuario', width: 100 },
    {
        field: 'date',
        headerName: 'Fecha',
        width: 100,
        renderCell: ({ value }) => <span>{new Date(value).toLocaleDateString()}</span>,
    },
    {
        field: 'mensajeConcepto',
        headerName: 'Concepto',
        width: 700,
    },
    {
        field: 'price',
        headerName: 'Precio',
        width: 100,
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
    console.log(data[0]);

    if (!data || data.length === 0) {
        return <ErrorMessageBox message="No se han encontrado transacciones" />;
    }

    return (
        <div style={{ width: '100%', marginTop: 2, height: '100%' }}>
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
                sx={{
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                    },
                    '& .MuiDataGrid-cell': {
                        '&:hover': {
                            backgroundColor: theme.palette.action.selected,
                        },
                    },
                    '& .MuiDataGrid-row': {
                        '&:nth-of-type(even)': {
                            backgroundColor: theme.palette.action.hover,
                        },
                    },
                }}
            />
        </div>
    );
}
