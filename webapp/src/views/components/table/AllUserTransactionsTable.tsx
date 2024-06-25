import { useTheme } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Transaction, TransactionConcept } from '../../../shared/sharedTypes';
import { getTransactionMessage } from '../../../utils/utils';
import ErrorMessageBox from '../MessagesBox/ErrorMessageBox';

interface UserTransactionsTableProps {
    data: Transaction[];
}



const columns: GridColDef[] = [
    { field: 'username', headerName: 'Usuario', width: 150 },
    {
        field: 'date',
        headerName: 'Fecha',
        width: 150,
        renderCell: ({ value }) => <span>{new Date(value).toLocaleDateString()}</span>,
    },
    {
        field: 'concept',
        headerName: 'Concepto',
        width: 250,
        renderCell: ({ value }) => <span>{getTransactionMessage(value[0] as TransactionConcept)}</span>,
    },
    {
        field: 'price',
        headerName: 'Precio',
        width: 150,
        renderCell: ({ value }) => (
            <div>
                <span style={{ verticalAlign: 'middle' }}>{value}</span>
                <img src="/zen.png" alt="Zen" style={{ width: 20, height: 20, marginLeft: 5, verticalAlign: 'middle' }} />
            </div>
        ),
    },
];

export default function AllUserTransactionsTable({ data }: UserTransactionsTableProps) {
    const theme = useTheme();

    console.log(data);
    if (!data || data.length === 0) {
        return <ErrorMessageBox message="No se han encontrado transacciones" />;
    }

    return (
        <div style={{ height: 400, width: '100%', marginTop: 2 }}>
            <DataGrid
                rows={data}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
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
