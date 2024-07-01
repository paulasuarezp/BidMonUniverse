import GavelIcon from '@mui/icons-material/Gavel';
import HistoryIcon from '@mui/icons-material/History';
import HomeIcon from '@mui/icons-material/Home';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// #region COMPONENT AdminNavigationMenu
// Menú de navegación para el administrador
export default function AdminNavigationMenu() {
    const [value, setValue] = React.useState('admin');
    const navigate = useNavigate();
    const location = useLocation();

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
        switch (newValue) {
            case 'admin':
                navigate('/admin');
                break;
            case 'auctions':
                navigate('/admin/auctions');
                break;
            case 'transactions':
                navigate('/admin/transactions');
                break;
        }
    };


    React.useEffect(() => {
        const path = location.pathname.replace('/', '');

        if (path === '') setValue('admin');
        else {
            if (path.includes('auction')) setValue('auctions');
            else if (path.includes('transaction')) setValue('transactions');
            else
                setValue('admin');
        }
    }, [location.pathname]);

    return (
        <Box sx={{ width: '100%' }}>
            <Tabs
                value={value}
                onChange={handleChange}
                textColor="secondary"
                indicatorColor="secondary"
                aria-label="Navegación principal del administrador"
                TabIndicatorProps={{ style: { height: '3px', bottom: '10px' } }}
                sx={{
                    '& .MuiTab-root:focus': {
                        outline: '2px solid #000',
                    }
                }}
            >
                <Tab
                    icon={<HomeIcon />}
                    value="admin"
                    iconPosition="start"
                    aria-label="Ir a Administración"
                />
                <Tab
                    icon={<GavelIcon />}
                    iconPosition="start"
                    value="auctions"
                    label='Subastas'
                    aria-label="Ir a Subastas"
                />
                <Tab
                    icon={<HistoryIcon />}
                    iconPosition="start"
                    value="transactions"
                    label='Histórico de transacciones'
                    aria-label="Ir a Histórico de transacciones"
                />
            </Tabs>
        </Box>
    );
}
// #endregion