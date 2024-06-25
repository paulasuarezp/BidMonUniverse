import CloseIcon from '@mui/icons-material/Close';
import { Box, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, useMediaQuery, useTheme } from '@mui/material';
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
        renderCell: ({ value }) => <span>{new Date(value).toLocaleString()}</span>,
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
                <img src="/zen.png" alt="Zen" style={{ width: 20, height: 20, marginLeft: 5 }} />
            </div>
        ),
    },
];

export default function AllUserTransactionsTable({ data }: UserTransactionsTableProps) {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down('xs'));
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState<string | null>(null);
    const [cellContent, setCellContent] = useState<string | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const handleCellClick = (params: any) => {
        if (!isXs && !isSm) return;

        if (params.field === 'mensajeConcepto' && params.value) {
            setTitle('Concepto');
            setCellContent(params.value);
            setOpen(true);
        }
        if (params.field === 'date' && params.value) {
            setTitle('Fecha');
            setCellContent(new Date(params.value).toLocaleString());
            setOpen(true);
        }
        if (params.field === 'price' && params.value) {
            setTitle('Precio');
            setCellContent(`${params.value} Zen`);
            setOpen(true);
        }
        if (params.field === 'username' && params.value) {
            setTitle('Usuario');
            setCellContent(params.value);
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setCellContent(null);
    };

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
                onCellClick={handleCellClick}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10, 20]}
                checkboxSelection
                getRowId={(row) => row._id}
                autoHeight
                localeText={{
                    toolbarDensity: 'Densidad',
                    toolbarDensityLabel: 'Densidad',
                    toolbarDensityCompact: 'Compacto',
                    toolbarDensityStandard: 'Estándar',
                    toolbarDensityComfortable: 'Cómodo',
                    toolbarColumns: 'Columnas',
                    toolbarColumnsLabel: 'Seleccionar columnas',
                    toolbarFilters: 'Filtros',
                    toolbarFiltersLabel: 'Mostrar filtros',
                    toolbarExport: 'Exportar',
                    toolbarExportLabel: 'Exportar',
                    toolbarExportCSV: 'Descargar como CSV',
                    toolbarExportPrint: 'Imprimir',
                    columnMenuSortAsc: 'Ordenar Ascendente',
                    columnMenuSortDesc: 'Ordenar Descendente',
                    columnMenuFilter: 'Filtrar',
                    columnMenuHideColumn: 'Ocultar columna',
                    columnMenuShowColumns: 'Mostrar columnas',
                    columnMenuUnsort: 'Desordenar',
                    columnMenuManageColumns: 'Administrar columnas',
                    columnsManagementShowHideAllText: 'Mostrar / Ocultar todas',
                    columnsManagementSearchTitle: 'Buscar columna',
                    columnsManagementReset: 'Restablecer',
                    noRowsLabel: 'No hay filas',
                    noResultsOverlayLabel: 'No se han encontrado resultados',
                    footerRowSelected: (count) => `${count.toLocaleString()} fila(s) seleccionada(s)`,
                    footerTotalRows: 'Total de filas:',
                    footerTotalVisibleRows: (visibleCount, totalCount) => `${visibleCount.toLocaleString()} de ${totalCount.toLocaleString()}`,
                    checkboxSelectionHeaderName: 'Selección',
                    booleanCellTrueLabel: 'sí',
                    booleanCellFalseLabel: 'no',
                    filterPanelAddFilter: 'Añadir filtro',
                    filterPanelDeleteIconLabel: 'Eliminar',
                    filterPanelOperator: 'Operador',
                    filterPanelOperatorAnd: 'Y',
                    filterPanelOperatorOr: 'O',
                    filterPanelColumns: 'Columnas',
                    filterPanelInputLabel: 'Valor',
                    filterPanelInputPlaceholder: 'Filtrar valor',
                    filterOperatorContains: 'contiene',
                    filterOperatorEquals: 'igual a',
                    filterOperatorStartsWith: 'empieza por',
                    filterOperatorEndsWith: 'termina en',
                    filterOperatorIs: 'es',
                    filterOperatorNot: 'no es',
                    filterOperatorAfter: 'después de',
                    filterOperatorOnOrAfter: 'en o después de',
                    filterOperatorBefore: 'antes de',
                    filterOperatorOnOrBefore: 'en o antes de',
                    filterOperatorIsEmpty: 'está vacío',
                    filterOperatorIsNotEmpty: 'no está vacío',
                    filterOperatorIsAnyOf: 'es cualquiera de',
                }}
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
                    '& .MuiDataGrid-footerContainer': {
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                    },
                }}
            />
            <Dialog open={open} onClose={handleClose} fullWidth>
                <DialogTitle>
                    {title}
                    <IconButton
                        aria-label="close"
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
                    <Box sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                        {cellContent}
                    </Box>
                </DialogContent>
            </Dialog>
        </div>
    );
}
